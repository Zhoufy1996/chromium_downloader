import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import CopyIp from './CopyIp';
import NullComponent from '../../components/NullComponent';
import SystemProxy from './SystemProxy';

const menuData: {
  key: string;
  name: string;
  component: () => JSX.Element;
}[] = [
  {
    key: 'ipCopy',
    name: 'ip复制',
    component: CopyIp,
  },
  {
    key: 'systemRead',
    name: '代理查看',
    component: SystemProxy,
  },
];

const Toolkit = () => {
  interface State {
    selectedKey: string;
  }

  const [state, setState] = useState<State>({
    selectedKey: 'ipCopy',
  });

  const handleRefresh = useCallback(() => {
    setState((pre) => {
      return {
        ...pre,
      };
    });
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const { selectedKey } = state;

  const selectedName = useMemo(() => {
    return menuData.find((item) => item.key === selectedKey)?.name || '未知';
  }, [selectedKey]);

  const Component = useMemo(() => {
    return (
      menuData.find((item) => item.key === selectedKey)?.component ||
      NullComponent
    );
  }, [selectedKey]);

  const menu = (
    <Menu
      onClick={({ key }) => {
        setState({
          selectedKey: key,
        });
      }}
      selectedKeys={[selectedKey]}
    >
      {menuData.map((item) => {
        return <Menu.Item key={item.key}>{item.name}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <div style={{ padding: 12, display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div style={{ marginRight: 12 }}>
        <Dropdown overlay={menu}>
          <Button>{selectedName}</Button>
        </Dropdown>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        <Component />
      </div>
    </div>
  );
};

export default Toolkit;
