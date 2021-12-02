import { Dropdown, Menu, message } from 'antd';
import React, { useState } from 'react';
import { rmdirSync } from 'fs';
import { ipcRenderer } from 'electron';
import { killAllChromiumProcess } from '../../utils';
import ChromiumContainer from '../../stores/chromium';

interface HelpActionsProps {
  style?: React.CSSProperties;
}

const HelpActions: React.FC<HelpActionsProps> = ({ style = {} }) => {
  interface State {
    visible: boolean;
  }

  const [state, setState] = useState<State>({
    visible: false,
  });

  const setVisible = (visible: boolean) => {
    setState((pre) => {
      return {
        ...pre,
        visible,
      };
    });
  };

  const {
    refreshLocalChromiumData,
    refreshRevisionToVersionMap,
    localChromiumData,
    revisionToVersionMap,
  } = ChromiumContainer.useContainer();

  const handleKillAllChromiumProcess = async () => {
    const hide = message.loading('关闭中', 0);
    killAllChromiumProcess(() => {
      hide();
      message.success('关闭成功');
    });
  };

  const handleRefresh = async () => {
    await refreshLocalChromiumData();
    await refreshRevisionToVersionMap();
    message.success('刷新成功');
  };

  const handleGetSpider = () => {
    ipcRenderer.send('start-chromium-spider');
  };

  const clearLocal = async () => {
    const hide = message.loading('清理中', 0);
    localChromiumData
      .filter((item) => {
        return revisionToVersionMap[item.revision] == null;
      })
      .forEach((item) => {
        rmdirSync(item.folderPath, { recursive: true });
      });
    hide();
    message.success('清理成功');
  };

  return (
    <Dropdown.Button
      visible={state.visible}
      onVisibleChange={(visible: boolean) => {
        setVisible(visible);
      }}
      style={style}
      overlay={
        <Menu
          onClick={({ key }) => {
            const map: { [k: string]: () => void } = {
              getData: handleGetSpider,
              refresh: handleRefresh,
              kill: handleKillAllChromiumProcess,
              clearLocal,
            };

            if (map[key]) {
              map[key]();
              setVisible(false);
            }
          }}
        >
          <Menu.Item key="getData">获取数据</Menu.Item>
          <Menu.Item key="refresh">刷新</Menu.Item>
          <Menu.Item key="clearLocal">清理无用文件</Menu.Item>
          <Menu.Item key="kill">关闭浏览器</Menu.Item>
        </Menu>
      }
    >
      操作
    </Dropdown.Button>
  );
};

export default HelpActions;
