import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { ipcRenderer, shell } from 'electron';
import menuConfig from './MenuConfig';
import DropDownButton from '../components/DropDownButton';
import store from '../../main/store';

const helpConfig: { key: string; title: string; onClick: () => void }[] = [
  {
    key: 'open_config',
    title: '打开数据文件',
    onClick: () => {
      store.openInEditor();
    },
  },
  {
    key: 'open_userData',
    title: '打开配置文件文件夹',
    onClick: async () => {
      const userDataPath = await ipcRenderer.invoke('get-userData-path');
      shell.openPath(userDataPath);
    },
  },
];

const handleHelpClick = ({ key }: { key: string }) => {
  helpConfig.find((item) => item.key === key)?.onClick();
};

const Header = () => {
  const history = useHistory();

  const pushToHistory = ({ key }: { key: string }) => {
    const selectedMenu = menuConfig.find((item) => item.key === key);
    if (selectedMenu != null) {
      history.push(selectedMenu.path);
    }
  };

  return (
    <div
      className="drag-header"
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <div>
        <DropDownButton
          buttonText="菜单"
          dataSource={menuConfig}
          onMenuClick={pushToHistory}
        />
        <DropDownButton
          buttonText="帮助"
          dataSource={helpConfig}
          onMenuClick={handleHelpClick}
        />
      </div>
      <div>
        <Button type="text" shape="circle">
          <MinusOutlined />
        </Button>
        <Button type="text" shape="circle">
          <CloseOutlined />
        </Button>
      </div>
    </div>
  );
};

export default Header;
