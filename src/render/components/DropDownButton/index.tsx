import { Button, Dropdown, Menu, MenuProps } from 'antd';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

interface DropDownMenuProps {
  onClick: MenuProps['onClick'];
  dataSource: {
    title: string;
    key: string;
  }[];
  showLastClick: boolean;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  onClick,
  dataSource,
  showLastClick = true,
}) => {
  const [selectedKey, setSelectedKeys] = useState<string>('');
  const handleMenuClick: MenuProps['onClick'] = (params) => {
    setSelectedKeys(params.key);
    if (onClick && typeof onClick === 'function') {
      onClick(params);
    }
  };

  return (
    <Menu
      onClick={handleMenuClick}
      selectedKeys={showLastClick ? [selectedKey] : []}
    >
      {dataSource.map((item) => {
        return <Menu.Item key={item.key}>{item.title}</Menu.Item>;
      })}
    </Menu>
  );
};

interface DropDownButtonProps {
  showLastClick?: boolean;
  buttonText: string;
  dataSource: {
    title: string;
    key: string;
    [k: string]: any;
  }[];
  onMenuClick: MenuProps['onClick'];
}

const DropDownButton: React.FC<DropDownButtonProps> = ({
  buttonText,
  dataSource,
  onMenuClick = () => {},
  showLastClick = true,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const closeDropdown = () => {
    setVisible(false);
  };

  const openDropdown = () => {
    setVisible(true);
  };
  const handleMenuClick: MenuProps['onClick'] = (args) => {
    closeDropdown();
    onMenuClick(args);
  };
  return (
    <OutsideClickHandler onOutsideClick={closeDropdown}>
      <Dropdown
        placement="bottomLeft"
        trigger={['click']}
        visible={visible}
        overlay={
          <DropDownMenu
            dataSource={dataSource}
            onClick={handleMenuClick}
            showLastClick={showLastClick}
          />
        }
      >
        <Button type="text" onClick={openDropdown}>
          {buttonText}
        </Button>
      </Dropdown>
    </OutsideClickHandler>
  );
};

export default DropDownButton;
