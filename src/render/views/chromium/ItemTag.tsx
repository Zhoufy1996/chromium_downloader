import React, { useMemo, useState } from 'react';
import { Popover, Tag, TagProps, Menu } from 'antd';
import { shell } from 'electron';
import { rmdirSync } from 'fs';
import ChromiumContainer from '../../stores/chromium';
import browerIpc from '../../ipc';

interface ItemTagProps {
  version: string;
  revision: string;
  isDownloaded: boolean;
  executablePath: string;
  folderPath: string;
}

const ItemTag = ({
  version,
  revision,
  isDownloaded,
  executablePath,
  folderPath,
}: ItemTagProps) => {
  const { refreshLocalChromiumData } = ChromiumContainer.useContainer();

  interface State {
    isDownloading: boolean;
  }

  const [state, setState] = useState<State>({
    isDownloading: false,
  });

  const color: TagProps['color'] = useMemo(() => {
    if (isDownloaded) {
      return 'success';
    }

    if (state.isDownloading) {
      return 'process';
    }

    return 'default';
  }, [isDownloaded, state.isDownloading]);

  // 打不开怎么办
  const openChromium = () => {
    try {
      shell.openPath(executablePath);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteChromium = async () => {
    rmdirSync(folderPath, { recursive: true });
    await refreshLocalChromiumData();
  };

  const downloadChromium = async () => {
    setState((pre) => {
      return {
        ...pre,
        isDownloading: true,
      };
    });
    await browerIpc.invoke('download-chrome', revision);
    setState((pre) => {
      return {
        ...pre,
        isDownloading: false,
      };
    });
    await refreshLocalChromiumData();
  };

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'download') {
          downloadChromium();
        }
        if (key === 'open') {
          openChromium();
        }

        if (key === 'delete') {
          deleteChromium();
        }
      }}
    >
      {!isDownloaded && (
        <>
          <Menu.Item key="download">下载</Menu.Item>
          <Menu.Item key="open">打开</Menu.Item>
        </>
      )}
      {isDownloaded && <Menu.Item key="delete">删除</Menu.Item>}
    </Menu>
  );

  return (
    <Popover title={revision} content={menu}>
      <Tag color={color}>{version}</Tag>
    </Popover>
  );
};

export default ItemTag;
