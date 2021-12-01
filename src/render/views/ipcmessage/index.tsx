import { Button, Table, TableProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import browerIpc from '../../ipc';

const IpcMessageView = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const refreshMessages = () => {
    setMessages(browerIpc.getMessages());
  };

  useEffect(() => {
    const key = browerIpc.addBrowserIpcListener((msgs) => {
      setMessages(msgs);
    });
    return () => {
      browerIpc.removeBrowserIpcListener(key);
    };
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
    <div style={{ padding: 12 }}>
      <div>
        <Button onClick={refreshMessages}>刷新</Button>
      </div>
      <div style={{ marginTop: 6 }}>
        <Table
          rowKey="seq"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default IpcMessageView;
