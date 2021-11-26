import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import browerIpc from '../../ipc';
import { killAllChromiumProcess } from '../../utils';
import ChromiumContainer from '../../stores/chromium';

const HelpActions = () => {
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

  const { refreshLocalChromiumData } = ChromiumContainer.useContainer();

  const handleKillAllChromiumProcess = async () => {
    killAllChromiumProcess(() => {});
  };

  const handleRefresh = async () => {
    await refreshLocalChromiumData();
  };

  const handleGetSpider = () => {
    browerIpc.invoke('start-chromium-spider');
  };

  return (
    <Dropdown.Button
      visible={state.visible}
      onClick={() => {
        setVisible(true);
      }}
      overlay={
        <Menu
          onClick={({ key }) => {
            const map: { [k: string]: () => void } = {
              getData: handleGetSpider,
              refresh: handleRefresh,
              kill: handleKillAllChromiumProcess,
            };

            if (map[key]) {
              map[key]();
              setVisible(false);
            }
          }}
        >
          <Menu.Item key="getData">获取数据</Menu.Item>
          <Menu.Item key="refresh">刷新</Menu.Item>
          <Menu.Item key="kill">重置</Menu.Item>
        </Menu>
      }
    >
      操作
    </Dropdown.Button>
  );
};

export default HelpActions;
