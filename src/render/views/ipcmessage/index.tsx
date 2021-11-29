import { Button, Table, TableProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import browerIpc from '../../ipc';

const IpcMessage = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const refreshMessages = () => {
    setMessages(browerIpc.getMessages());
  };

  useEffect(() => {
    browerIpc.getMessages();
  }, []);

  const dataSource = useMemo(() => {
    return messages.map((item, index) => {
      return {
        seq: index + 1,
        message: item,
      };
    });
  }, [messages]);

  const columns: TableProps<typeof dataSource[0]>['columns'] = [
    {
      dataIndex: 'seq',
      key: 'seq',
      width: 100,
    },
    {
      dataIndex: 'message',
      key: 'message',
    },
  ];

  return (
    <div>
      <div>
        <Button onClick={refreshMessages}>刷新</Button>
      </div>
      <div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default IpcMessage;
