import { app } from 'electron';
import { getLocalChromiumRevisions } from '../../common/file';
import { average } from '../../common/utils';
import store from '../store';
import ChromiumSpider from './spider';

const handleFilterRevisions = (revisions: string[]) => {
  const setting = store.get('setting');
  const startIndex = Math.floor(Math.random() * Number(setting.interval.value));
  let index = startIndex;
  const shouldSearchedRevisions: string[] = [];
  while (index <= revisions.length) {
    shouldSearchedRevisions.push(revisions[index]);
    index += Number(setting.interval.value);
  }
  return shouldSearchedRevisions;
};

const cutRepetitionVersion = (map: {
  [k: string]: string;
}): { [k: string]: string } => {
  const newMap: { [k: string]: { version: string; revision: string } } = {};
  Object.keys(map).forEach((revision) => {
    const version = map[revision];
    const versionInt = version.split('.')[0];
    newMap[versionInt] = { version, revision };
  });

  return Object.fromEntries(
    Object.keys(newMap).map((versionInt) => {
      return [newMap[versionInt].revision, newMap[versionInt].version];
    })
  );
};

type Status =
  | 'NOT_START'
  | 'IS_PAUSE'
  | 'GET_REVISIONS'
  | 'GET_VERSIONS'
  | 'FINISHED';

/**
 * 控制spider数据存储逻辑与界面交互逻辑
 */
class ChromiumService {
  spider: null | ChromiumSpider;

  constructor() {
    this.spider = null;
  }

  getSpider() {
    if (!this.spider) {
      const setting = store.get('setting');
      const spider = new ChromiumSpider({
        handleFilterRevisions,
        prefix: String(setting.prefix.value),
      });
      this.spider = spider;
    }
    return this.spider;
  }

  async start() {
    const spider = this.getSpider();
    spider.start();
  }

  async pause() {
    const spider = this.getSpider();
    spider.pause();
  }

  async continue() {
    const spider = this.getSpider();
    spider.continue();
  }

  async destory() {
    if (this.spider) {
      this.spider.destory();
      this.spider = null;
    }
  }

  getStatus(): Status {
    if (this.spider == null) {
      return 'NOT_START';
    }
    const { shouldYield, revisions, searchedVersions } = this.spider;

    if (shouldYield) {
      return 'IS_PAUSE';
    }

    if (revisions.length === 0) {
      return 'GET_REVISIONS';
    }

    if (Object.keys(searchedVersions).length < revisions.length) {
      return 'GET_VERSIONS';
    }

    return 'FINISHED';
  }

  async stop() {
    this.destory();
  }

  async getMessage() {
    if (this.spider == null) {
      return '';
    }

    const status = this.getStatus();
    const { revisions, searchedVersions } = this.spider;

    const averageTime = average(
      ...Object.values(searchedVersions).map((item) => item.searchedTimeMS)
    );

    type MessageMap = {
      [State in Status]: string;
    };
    const messageMap: MessageMap = {
      NOT_START: '未开始',
      IS_PAUSE: '暂停中',
      GET_REVISIONS: '获取修订号中',
      GET_VERSIONS: `获取版本号中,进度：${
        Object.keys(searchedVersions).length
      }/${revisions.length},预计时间：${(
        (averageTime *
          (revisions.length - Object.keys(searchedVersions).length)) /
        1000
      ).toFixed(0)}秒`,
      FINISHED: `爬取完毕：共计${revisions.length}个,请刷新。`,
    };

    return messageMap[status];
  }

  async saveToStore() {
    if (this.spider == null) {
      return;
    }
    if (this.getStatus() !== 'FINISHED') {
      return;
    }
    const { revisions, searchedVersions } = this.spider;
    const revisionToVersionMap = store.get('revisionToVersionMap');
    const downloadedRevisions = await getLocalChromiumRevisions(
      app.getPath('userData')
    );
    const newRevisions = [
      ...new Set([
        ...revisions.filter((revision) => {
          return searchedVersions[revision].version !== 'error';
        }),
        ...downloadedRevisions,
      ]),
    ].filter((revision) => {
      const version =
        revisionToVersionMap[revision] || searchedVersions[revision]?.version;
      return !!version;
    });
    const newMap = cutRepetitionVersion(
      Object.fromEntries(
        newRevisions.map((revision) => {
          const version =
            revisionToVersionMap[revision] ||
            searchedVersions[revision]?.version;
          return [revision, version];
        })
      )
    );
    store.set('revisions', Object.keys(newMap));
    store.set('revisionToVersionMap', newMap);
  }

  async getSpiderTrayMenu(): Promise<
    (Electron.MenuItem | Electron.MenuItemConstructorOptions)[]
  > {
    const status = this.getStatus();

    type MenuMap = {
      [state in Status]: (
        | Electron.MenuItem
        | Electron.MenuItemConstructorOptions
      )[];
    };

    const menuMap: MenuMap = {
      NOT_START: [
        {
          label: '开始爬虫',
          click: () => {
            this.start();
          },
        },
      ],
      IS_PAUSE: [
        {
          label: '继续',
          click: () => {
            this.continue();
          },
        },
        {
          label: '停止',
          click: () => {
            this.stop();
          },
        },
      ],
      GET_REVISIONS: [
        {
          label: '暂停',
          click: () => {
            this.pause();
          },
        },
        {
          label: '停止',
          click: () => {
            this.stop();
          },
        },
      ],
      GET_VERSIONS: [
        {
          label: '暂停',
          click: () => {
            this.pause();
          },
        },
        {
          label: '停止',
          click: () => {
            this.stop();
          },
        },
      ],
      FINISHED: [
        {
          label: '开始爬虫',
          click: () => {
            this.start();
          },
        },
      ],
    };

    return menuMap[status] || [];
  }
}

let chromiumService: ChromiumService | null = null;

const hasSpiderExist = () => {
  return chromiumService != null;
};

export const getSpider = () => {
  if (chromiumService == null) {
    chromiumService = new ChromiumService();
  }
  return chromiumService;
};

export const startSpider = () => {
  getSpider().start();
};

export const pauseSpider = () => {
  if (hasSpiderExist()) {
    getSpider().pause();
  }
};

export const continueSpider = () => {
  if (hasSpiderExist()) {
    getSpider().continue();
  }
};

export const stopSpider = () => {
  if (hasSpiderExist()) {
    getSpider().stop();
  }
};

export const getSpiderMessage = async () => {
  if (hasSpiderExist()) {
    return getSpider().getMessage();
  }
  return '';
};

export const saveToStore = () => {
  if (hasSpiderExist()) {
    getSpider().saveToStore();
  }
};

export const getSpiderTrayMenu = async () => {
  if (chromiumService == null) {
    return [];
  }
  return getSpider().getSpiderTrayMenu();
};

export const isFinished = () => {
  if (hasSpiderExist()) {
    return getSpider().getStatus() === 'FINISHED';
  }
  return false;
};

export const destorySpider = () => {
  if (hasSpiderExist()) {
    getSpider().destory();
    chromiumService = null;
  }
};
