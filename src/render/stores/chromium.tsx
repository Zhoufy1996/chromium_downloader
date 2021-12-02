import { useCallback, useEffect, useState } from 'react';
import { readdirSync } from 'fs';
import path from 'path';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';
import store from '../../main/store';
import { getLocalChromiumFolderNames } from '../../common/file';
import { chromiumFoldName } from '../../common/constant';
import { Listener } from '../ipc';

const useChromium = () => {
  interface State {
    localChromiumData: {
      revision: string;
      executablePath: string;
      folderPath: string;
    }[];
    revisionToVersionMap: {
      [revision: string]: string;
    };
    chromiumSpiderRes: string;
  }

  type LocalChromiumItem = State['localChromiumData'][0];

  const [state, setState] = useState<State>({
    localChromiumData: [],
    revisionToVersionMap: {},
    chromiumSpiderRes: '',
  });

  // 获取本地chromium数据
  const refreshLocalChromiumData = useCallback(async () => {
    const userData = await ipcRenderer.invoke('get-userData-path');
    const getChromiumData = (folderName: string): LocalChromiumItem => {
      const revision = folderName.split('-')[1];
      const folder = readdirSync(
        path.join(userData, chromiumFoldName, folderName)
      );
      return {
        revision,
        executablePath: path.join(
          userData,
          chromiumFoldName,
          folderName,
          folder[0],
          'chrome.exe'
        ),
        folderPath: path.join(userData, chromiumFoldName, folderName),
      };
    };
    const chromiumArr: LocalChromiumItem[] = (
      await getLocalChromiumFolderNames(userData)
    ).map(
      (item): LocalChromiumItem => {
        return getChromiumData(item);
      }
    );

    setState((pre) => {
      return {
        ...pre,
        localChromiumData: chromiumArr,
      };
    });
  }, []);

  const refreshRevisionToVersionMap = useCallback(() => {
    const revisionToVersionMap = store.get('revisionToVersionMap');
    setState((pre) => {
      return {
        ...pre,
        revisionToVersionMap,
      };
    });
  }, []);

  useEffect(() => {
    refreshRevisionToVersionMap();
    refreshLocalChromiumData();
  }, [refreshRevisionToVersionMap, refreshLocalChromiumData]);

  useEffect(() => {
    const listener: Listener = (_, message: string) => {
      setState((pre) => {
        return {
          ...pre,
          chromiumSpiderRes: message,
        };
      });
    };
    ipcRenderer.on('chromium-spider-res', listener);

    return () => {
      ipcRenderer.removeListener('chromium-spider-res', listener);
    };
  }, []);

  const { localChromiumData, revisionToVersionMap, chromiumSpiderRes } = state;
  return {
    localChromiumData,
    revisionToVersionMap,
    refreshRevisionToVersionMap,
    refreshLocalChromiumData,
    chromiumSpiderRes,
  };
};

const ChromiumContainer = createContainer(useChromium);

export default ChromiumContainer;
