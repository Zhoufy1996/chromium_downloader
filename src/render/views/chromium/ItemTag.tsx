import React, { useMemo, useState } from 'react';
import { Tag, TagProps, Menu, Dropdown } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { ipcRenderer, shell } from 'electron';
import { rmdirSync } from 'fs';
import ChromiumContainer from '../../stores/chromium';

interface ItemTagProps {
  version: string;
  revision: string;
  isDownloaded: boolean;
  executablePath: string;
  folderPath: string;
}

const ItemTag: React.FC<ItemTagProps> = ({
  version,
  revision,
  isDownloaded,
  executablePath,
  folderPath,
}) => {
  const { refreshLocalChromiumData } = ChromiumContainer.useContainer();

  interface State {
    isDownloading: boolean;
  }

  const [state, setState] = useState<State>({
    isDownloading: false,
  });

  const status = useMemo(() => {
    if (state.isDownloading) {
      return 'downloading';
    }

    if (isDownloaded) {
      return 'isDownloaded';
    }

    return 'notDownloaded';
  }, [isDownloaded, state.isDownloading]);

  const color: TagProps['color'] = useMemo(() => {
    if (status === 'isDownloaded') {
      return 'success';
    }

    if (status === 'downloading') {
      return 'process';
    }

    return 'default';
  }, [status]);

  const icon = useMemo(() => {
    if (status === 'downloading') {
      return <SyncOutlined spin />;
    }
    return null;
  }, [status]);

  const menu = useMemo(() => {
    if (status === 'isDownloaded') {
      return (
        <Menu
          onClick={async ({ key }) => {
            if (key === 'open') {
              try {
                shell.openPath(executablePath);
              } catch (e) {
                console.log(e);
              }
            }

            if (key === 'delete') {
              rmdirSync(folderPath, { recursive: true });
              await refreshLocalChromiumData();
            }
          }}
        >
          <Menu.Item key="open">打开</Menu.Item>
          <Menu.Divider />
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      );
    }

    return (
      <Menu
        onClick={async () => {
          setState((pre) => {
            return {
              ...pre,
              isDownloading: true,
            };
          });
          await ipcRenderer.invoke('download-chrome', revision);
          setState((pre) => {
            return {
              ...pre,
              isDownloading: false,
            };
          });
          await refreshLocalChromiumData();
        }}
      >
        <Menu.Item key="download">下载</Menu.Item>
      </Menu>
    );
  }, [status, executablePath, refreshLocalChromiumData, revision, folderPath]);

  const tag = useMemo(() => {
    return (
      <Tag
        icon={icon}
        color={color}
        style={{ marginTop: 15, cursor: 'pointer', width: 90 }}
      >
        {version}
      </Tag>
    );
  }, [color, icon, version]);
  return (
    <>
      {status === 'downloading' ? (
        tag
      ) : (
        <Dropdown overlay={menu}>{tag}</Dropdown>
      )}
    </>
  );
};

export default ItemTag;
