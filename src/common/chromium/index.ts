import { ChromiumServiceSteps, SpiderCallbackProps } from './types';

type SpiderResMsgFuncMap = {
  [step in ChromiumServiceSteps]: (
    spiderResMap?: SpiderCallbackProps
  ) => string;
};

const spiderResMsgFuncMap: SpiderResMsgFuncMap = {
  UNDO: () => {
    return '';
  },
  INIT: () => {
    return '初始化中';
  },
  GETREVISIONS: () => {
    return '获取修订号中';
  },
  SEARCHVERSIONS: (spiderResMap) => {
    if (spiderResMap) {
      const { searchAllCount, searchedCount } = spiderResMap;
      return `搜索版本中: ${searchedCount}/${searchAllCount}`;
    }
    return `搜索版本中`;
  },
  FINISHED: () => {
    return '配置获取结束';
  },
  ERROR: (spiderResMap) => {
    if (spiderResMap) {
      const { searchAllCount, searchedCount } = spiderResMap;
      return `获取版本出错啦: ${searchedCount}/${searchAllCount}`;
    }
    return `获取版本出错啦`;
  },
};

export const getSpiderResMessage = (spiderResMap: SpiderCallbackProps) => {
  return spiderResMsgFuncMap[spiderResMap.step](spiderResMap);
};
