import puppeteer from 'puppeteer-core';
import { app, BrowserWindow } from 'electron';
import pie from 'puppeteer-in-electron';
import { sleep } from '../../common/utils';

/**
 * 爬虫的核心，处理单个界面数据获取逻辑
 */
class ChromiumSpiderCore {
  private browser: puppeteer.Browser | undefined;

  private window: BrowserWindow | undefined;

  private prefix: string;

  constructor({ prefix }: { prefix: string }) {
    this.prefix = prefix;
  }

  // 单例,使用尽可能少的内存
  private async getPage() {
    if (this.browser == null) {
      // https://stackoverflow.com/questions/58213258/how-to-use-puppeteer-core-with-electron
      this.browser = await pie.connect(app, puppeteer);
    }
    if (this.window == null) {
      this.window = new BrowserWindow({
        show: true,
      });
    }
    const page = await pie.getPage(this.browser, this.window);
    return page;
  }

  async getAllRevisionsCore() {
    const page = await this.getPage();
    const { prefix } = this;
    let revisions: string[] = [];
    /**
     * 踩点可知，请求返回的数据结构为
     * {
     *    kind: "storage#objects"
     *    nextPageToken: "CgtXaW4vMTY5NDM3Lw=="
     *    prefixes: string[]
     * }
     * prefixe: "Win_x64/396190/"  prefix/revision/
     */
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

    // 如果不sleep,response可能还没处理完
    await sleep(1000);

    page.removeAllListeners();
    return revisions;
  }

  async getVersionByRevision(revision: string) {
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
    await sleep(1000);

    if (version == null) {
      throw new Error(`not found: ${revision}`);
    }

    return version;
  }

  destory() {
    this.window?.destroy();
  }
}

export default ChromiumSpiderCore;