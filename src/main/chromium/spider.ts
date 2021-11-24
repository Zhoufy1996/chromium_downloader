import ChromiumSpiderCore from './core';

interface HandleFilterRevisions {
  (revisions: string[]): string[];
}

interface ChromiumSpiderProps {
  handleFilterRevisions: HandleFilterRevisions;
  prefix: string;
}

/**
 * 控制整个爬虫的运行逻辑
 */
class ChromiumSpider extends ChromiumSpiderCore {
  revisions: string[];

  private handleFilterRevisions: HandleFilterRevisions;

  shouldYield: boolean;

  searchedVersions: {
    [revision: string]: {
      version: string; // 如果搜索失败，则为error
      searchedTimeMS: number; // 搜索所需时间/毫秒
    };
  };

  constructor(props: ChromiumSpiderProps) {
    super({
      prefix: props.prefix,
    });
    this.handleFilterRevisions = props.handleFilterRevisions;
    this.revisions = [];
    this.searchedVersions = {};
    this.shouldYield = false;
  }

  async getAllRevisions() {
    const revisions = await this.getAllRevisionsCore();
    this.revisions = this.handleFilterRevisions(revisions);
    return this;
  }

  async getAllVersions() {
    const getNextRevision = (): string | undefined => {
      return this.revisions[Object.keys(this.searchedVersions).length];
    };
    const getVersionCirculation = async () => {
      const st = new Date().getTime();
      const nextRevision = getNextRevision();
      if (nextRevision == null || this.shouldYield) {
        return;
      }
      let version = '';
      try {
        version = await this.getVersionByRevision(nextRevision);
      } catch (e) {
        version = 'error';
      } finally {
        this.searchedVersions[nextRevision] = {
          version,
          searchedTimeMS: new Date().getTime() - st,
        };
        await getVersionCirculation();
      }
    };

    await getVersionCirculation();

    return this;
  }

  pause() {
    this.shouldYield = true;
  }

  async start() {
    if (this.revisions.length === 0) {
      await this.getAllRevisions();
    }

    await this.getAllVersions();
  }

  async continue() {
    await this.start();
  }

  async stop() {
    await this.destory();
  }
}

export default ChromiumSpider;
