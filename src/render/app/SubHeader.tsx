import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import browerIpc from '../ipc';

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
            browerIpc.send('close');
          }}
        >
          <CloseOutlined />
        </Button>
      </div>
    </div>
  );
};

export default SubHeader;
