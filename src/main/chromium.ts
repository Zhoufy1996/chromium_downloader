/* eslint-disable no-console */
import puppeteer, { PuppeteerNode, BrowserFetcher } from 'puppeteer-core';
import { app, BrowserWindow } from 'electron';
import pie from 'puppeteer-in-electron';
import { sleep } from '../common/utils';
import store, { RevisionToVersionMap, Revisions } from './store';
import { getChromiumSavePath } from './utils';
import { getLocalChromiumRevisions } from '../common/file';
import {
  ChromiumServiceSteps,
  SpiderCallbackProps,
} from '../common/chromium/types';
import { getSpiderResMessage } from '../common/chromium';
// eslint-disable-next-line import/no-cycle
import { initialTrayTooltip, setTrayTooltip, updateTrayMenu } from './tray';

global.isCollecting = false;
class ChromiumService {
  private prefix: string;

  revisions: Revisions;

  private interval: number;

  revisionToVersionMap: RevisionToVersionMap;

  searchAllCount = 0;

  searchedCount = 0;

  step: ChromiumServiceSteps = 'INIT';

  private browser: puppeteer.Browser | undefined;

  private window: BrowserWindow | undefined;

  constructor(prefix = 'Win', interval = 500) {
    this.prefix = prefix;
    this.revisions = [];
    this.interval = interval;
    this.revisionToVersionMap = {};
  }

  private changeStep(step: ChromiumServiceSteps) {
    this.step = step;
  }

  private async getPage() {
    if (this.browser == null) {
      this.browser = await pie.connect(app, puppeteer);
    }
    if (this.window == null) {
      this.window = new BrowserWindow({
        show: false,
      });
    }
    const page = await pie.getPage(this.browser, this.window);
    return page;
  }

  async getAllRevisions() {
    this.changeStep('GETREVISIONS');

    const page = await this.getPage();

    let revisions: string[] = [];

    const getRevisions = (response: puppeteer.HTTPResponse) => {
      if (response.url().includes('v1')) {
        response
          .text()
          .then((res) => {
            const { prefixes = [] }: { prefixes: string[] } = JSON.parse(res);
            revisions = [
              ...revisions,
              ...prefixes.map((str) => {
                const arr = str.split('/');
                return arr[1];
              }),
            ];

            return revisions;
          })
          .catch((e) => {
            console.log('res err: \n', e);
          });
      }
    };

    page.on('response', getRevisions);
    const { prefix } = this;

    await page.goto(
      `http://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=${prefix}/`,
      { waitUntil: 'networkidle2' }
    );

    //  等待页面加载完全
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const id = setInterval(() => {
          const loading = document.querySelector(
            '.loader-spinner'
          ) as HTMLElement;
          if (loading && loading.offsetHeight === 0) {
            clearInterval(id);
            resolve(true);
          }
        }, 500);
      });
    });

    await sleep(2000);
    this.revisions = revisions;

    page.removeAllListeners();

    return this;
  }

  addSearchedCount() {
    this.searchedCount += 1;
  }

  private addToVersionMap(revision: string, version: string) {
    this.revisionToVersionMap = {
      ...this.revisionToVersionMap,
      [revision]: version,
    };
    this.addSearchedCount();
  }

  private nextIndexBuilder() {
    const { interval } = this;
    let nextIndex = Math.floor(Math.random() * interval);
    this.calculateSearchAllCount(nextIndex);
    return () => {
      const currentIndex = nextIndex;
      nextIndex += interval;
      return currentIndex;
    };
  }

  private calculateSearchAllCount(startIndex: number) {
    const { revisions, interval } = this;
    if (startIndex < revisions.length) {
      this.searchAllCount =
        Math.floor((revisions.length - startIndex - 1) / interval) + 1;
    } else {
      this.searchAllCount = 0;
    }
  }

  private nextRevisionBuilder() {
    const { revisions } = this;
    const getNextIndex = this.nextIndexBuilder();
    return () => {
      const index = getNextIndex();
      const revision = revisions[index];
      return revision;
    };
  }

  async getVersions() {
    this.changeStep('SEARCHVERSIONS');
    const getNextRevision = this.nextRevisionBuilder();

    const getVersionCirculation = async () => {
      const nextRevision = getNextRevision();
      if (nextRevision != null) {
        try {
          const version = await this.getVersion(nextRevision);
          this.addToVersionMap(nextRevision, version);
          await getVersionCirculation();
        } catch (e) {
          this.addToVersionMap(nextRevision, 'error');
          await getVersionCirculation();
        }
      }
    };

    await getVersionCirculation();

    return this;
  }

  private async getVersion(revision: string) {
    const page = await this.getPage();
    try {
      await page.goto(
        `https://storage.googleapis.com/chromium-find-releases-static/index.html#r${revision}`,
        { waitUntil: 'networkidle2' }
      );
      await page.waitForFunction(
        () => {
          return document.querySelector('code')?.textContent != null;
        },
        {
          timeout: 3000,
        }
      );
    } catch (e) {
      throw new Error(`get error: ${revision}`);
    }

    const version = await page.evaluate(() => {
      return document.querySelector('code')?.textContent;
    });
    await sleep(2000);

    if (version == null) {
      throw new Error(`not found: ${revision}`);
    }

    return version;
  }

  async destroy() {
    this.changeStep('FINISHED');
    this.window?.destroy();
  }

  static async downloadChromium({
    revision = '896380',
    downloadPath = getChromiumSavePath(),
  }: {
    revision?: string;
    downloadPath?: string;
  }) {
    let executablePath = '';
    try {
      const browserFetcher = ((puppeteer as unknown) as PuppeteerNode).createBrowserFetcher(
        { path: downloadPath, platform: 'win64' }
      ) as BrowserFetcher;

      const revisionInfo = await browserFetcher.download(revision);
      executablePath = revisionInfo.executablePath;
    } catch (e) {
      try {
        const browserFetcher = ((puppeteer as unknown) as PuppeteerNode).createBrowserFetcher(
          { path: downloadPath, platform: 'win32' }
        ) as BrowserFetcher;

        const revisionInfo = await browserFetcher.download(revision);
        executablePath = revisionInfo.executablePath;
      } catch (err) {
        throw new Error('找不到对应的下载文件');
      }
    }

    return executablePath;
  }
}

interface StartSpiderCallback {
  ({ step, searchAllCount, searchedCount }: SpiderCallbackProps): void;
}

export const startSpider = async () => {
  if (global.isCollecting) {
    return;
  }

  global.isCollecting = true;

  const callback: StartSpiderCallback = (data) => {
    const mainId = global.mianId;
    const mainBrowser = BrowserWindow.fromId(mainId);
    mainBrowser?.webContents.send('chromium-spider-res', data);
    setTrayTooltip(getSpiderResMessage(data));
    if (data.step === 'FINISHED') {
      initialTrayTooltip();
    }
  };
  const setting = store.get('setting');
  const chromiumService = new ChromiumService(
    setting.prefix.value as string,
    Number(setting.interval.value) as number
  );

  updateTrayMenu();
  global.spider = chromiumService;

  const timerId = setInterval(() => {
    const { searchAllCount, searchedCount, step } = chromiumService;
    callback({
      step,
      searchAllCount,
      searchedCount,
    });
    if (step === 'FINISHED') {
      clearInterval(timerId);
    }
  }, 1000);

  const getDownloadedChromiumMap = async (): Promise<RevisionToVersionMap> => {
    const downloadedRevisions = await getLocalChromiumRevisions(
      app.getPath('userData')
    );
    const oldMap = store.get('revisionToVersionMap');
    return Object.fromEntries(
      downloadedRevisions.map((revision) => {
        return [revision, oldMap[revision]];
      })
    );
  };

  // 相同版本的只保留后一个
  const handleCutSameVersion = (
    revisionToVersionMap: RevisionToVersionMap
  ): RevisionToVersionMap => {
    const temp: {
      [intVersion: string]: { version: string; revision: string };
    } = {};

    Object.keys(revisionToVersionMap).forEach((revision) => {
      const version = revisionToVersionMap[revision];
      if (typeof version !== 'string' || version === 'error') {
        return;
      }

      const intVersion = version.split('.')[0];
      temp[intVersion] = { revision, version };
    });

    return Object.fromEntries(
      Object.values(temp).map((data) => [data.revision, data.version])
    );
  };

  const setSpiderDataToStore = async () => {
    const { revisions, revisionToVersionMap } = chromiumService;
    store.set('revisions', revisions);
    const downloadedChromoiumMap = await getDownloadedChromiumMap();
    store.set(
      'revisionToVersionMap',
      handleCutSameVersion({
        ...revisionToVersionMap,
        ...downloadedChromoiumMap,
      })
    );
  };

  const handleExecuteSpider = async () => {
    await chromiumService.getAllRevisions();
    await chromiumService.getVersions();
    await setSpiderDataToStore();
    global.isCollecting = false;
    chromiumService.destroy();
    return true;
  };

  handleExecuteSpider().catch((e) => {
    console.log(e);
    const { searchAllCount, searchedCount } = chromiumService;
    clearInterval(timerId);
    // eslint-disable-next-line promise/no-callback-in-promise
    callback({
      step: 'ERROR',
      searchAllCount,
      searchedCount,
    });
    global.isCollecting = false;
    chromiumService.destroy();
  });
};

export const stopSpider = () => {
  if (global.spider) {
    global.spider.destroy();
    const mainId = global.mianId;
    const mainBrowser = BrowserWindow.fromId(mainId);
    mainBrowser?.webContents.send('chromium-spider-res', {
      step: 'UNDO',
      searchAllCount: 0,
      searchedCount: 0,
    });
    global.isCollecting = false;

    updateTrayMenu();
    setTimeout(() => {
      initialTrayTooltip();
    }, 1000);
  }
};

export default ChromiumService;
