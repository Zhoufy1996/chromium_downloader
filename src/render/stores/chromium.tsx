import { useCallback, useEffect, useState } from 'react';
import { readdirSync } from 'fs';
import path from 'path';
import { createContainer } from 'unstated-next';
import store from '../../main/store';
import { getLocalChromiumFolderNames } from '../../common/file';
import { chromeFoldName } from '../../common/constant';
import browerIpc from '../ipc';

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
  }

  type LocalChromiumItem = State['localChromiumData'][0];

  const [state, setState] = useState<State>({
    localChromiumData: [],
    revisionToVersionMap: {},
  });

  // 获取本地chromium数据
  const refreshLocalChromiumData = useCallback(async () => {
    const userData = await browerIpc.invoke('get-userData-path');
    const getChromiumData = (folderName: string): LocalChromiumItem => {
      const revision = folderName.split('-')[1];
      const folder = readdirSync(
        path.join(userData, chromeFoldName, folderName)
      );
      return {
        revision,
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

  const { localChromiumData, revisionToVersionMap } = state;

  return {
    localChromiumData,
    revisionToVersionMap,
    refreshRevisionToVersionMap,
    refreshLocalChromiumData,
  };
};

const ChromiumContainer = createContainer(useChromium);

export default ChromiumContainer;
