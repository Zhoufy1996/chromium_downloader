import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import menuConfig from './MenuConfig';
import DropDownButton from '../components/DropDownButton';

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
          dataSource={menuConfig}
          onMenuClick={pushToHistory}
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
