import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ipcRenderer } from 'electron';

const SubHeader = () => {
  return (
    <div
      className="drag-header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div />
      <div>
        <Button
          type="text"
          shape="circle"
          onClick={() => {
            ipcRenderer.send('close');
          }}
        >
          <CloseOutlined />
        </Button>
      </div>
    </div>
  );
};

export default SubHeader;
