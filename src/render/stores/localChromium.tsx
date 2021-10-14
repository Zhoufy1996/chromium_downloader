import { useState, useCallback, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';
import path from 'path';
import { readdirSync, rmdirSync } from 'fs';
import store, { RevisionToVersionMap } from '../../main/store';
import { chromeFoldName } from '../../common/constant';
import { getLocalChromiumFolderNames } from '../../common/file';
import {
  ChromiumServiceSteps,
  SpiderCallbackProps,
} from '../../common/chromium/types';

export type SpiderResSteps = ChromiumServiceSteps;
export type SpiderRes = SpiderCallbackProps;

interface LocalChromiumData {
  revision: string;
  version: string;
  executablePath: string;
  folderPath: string;
}

interface State {
  localChromiumData: {
    [revision: string]: LocalChromiumData;
  };
  spiderRes: SpiderRes;
  downloadingRevision: string;
  revisionToVersionMap: RevisionToVersionMap;
}

export type LocalChromoimState = State;

const useLocalChromium = () => {
  const [state, setState] = useState<State>({
    localChromiumData: {},
    spiderRes: {
      step: 'UNDO',
      searchAllCount: 0,
      searchedCount: 0,
    },
    downloadingRevision: '',
    revisionToVersionMap: {},
  });

  const handleSpider = useCallback(async () => {
    await ipcRenderer.send('start-chromium-spider');
  }, []);

  useEffect(() => {
    ipcRenderer.on('chromium-spider-res', (_, data: State['spiderRes']) => {
      setState((pre) => {
        return {
          ...pre,
          spiderRes: data,
        };
      });
    });
  }, []);

  const GetLocalChromiumPaths = useCallback(async () => {
    const userData = await ipcRenderer.invoke('get-userData-path');
    const revisionToVersionMap = store.get('revisionToVersionMap');
    const getChromiumData = (folderName: string): LocalChromiumData => {
      const revision = folderName.split('-')[1];
      const version = revisionToVersionMap[revision];
      const folder = readdirSync(
        path.join(userData, chromeFoldName, folderName)
      );
      return {
        revision,
        version,
        executablePath: path.join(
          userData,
          chromeFoldName,
          folderName,
          folder[0],
          'chrome.exe'
        ),
        folderPath: path.join(userData, chromeFoldName, folderName),
      };
    };

    const chromiumArr: [string, LocalChromiumData][] = (
      await getLocalChromiumFolderNames(userData)
    ).map((item): [string, LocalChromiumData] => {
      const chromiumData: LocalChromiumData = getChromiumData(item);
      return [chromiumData.revision, chromiumData];
    });
    setState((pre) => {
      return {
        ...pre,
        localChromiumData: Object.fromEntries(chromiumArr),
        revisionToVersionMap,
      };
    });
  }, []);

  const downloadChrome = useCallback(
    async (revision: string) => {
      setState((pre) => {
        return {
          ...pre,
          downloadingRevision: revision,
        };
      });
      await ipcRenderer.invoke('download-chrome', revision);
      setState((pre) => {
        return {
          ...pre,
          downloadingRevision: '',
        };
      });
      await GetLocalChromiumPaths();
    },
    [GetLocalChromiumPaths]
  );

  const deleteChrome = useCallback(
    async (folderPath: string) => {
      rmdirSync(folderPath, { recursive: true });
      await GetLocalChromiumPaths();
    },
    [GetLocalChromiumPaths]
  );

  const initSpiderStep = useCallback(() => {
    setState((pre) => {
      return {
        ...pre,
        spiderRes: {
          ...pre.spiderRes,
          step: 'UNDO',
        },
      };
    });
  }, []);
  const {
    localChromiumData,
    spiderRes,
    downloadingRevision,
    revisionToVersionMap,
  } = state;

  return {
    localChromiumData,
    spiderRes,
    downloadingRevision,
    revisionToVersionMap,
    GetLocalChromiumPaths,
    downloadChrome,
    deleteChrome,
    handleSpider,
    initSpiderStep,
  };
};

const LocalChromiumContainer = createContainer(useLocalChromium);

export default LocalChromiumContainer;
