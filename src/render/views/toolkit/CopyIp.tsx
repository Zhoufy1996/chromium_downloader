/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ip from 'ip';
import { Button, message, Table, TableProps } from 'antd';
import store, { IpData } from '../../../main/store';
import CopyButton from '../../components/CopyButton';

const CopyIp = () => {
  interface State {
    ips: IpData[];
  }

  const [state, setState] = useState<State>({
    ips: [],
  });

  const handleRefresh = useCallback(() => {
    setState({
      ips: [
        {
          name: '本机',
          ip: ip.address(),
        },
        ...(store.get('ips') || []),
      ],
    });
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const columns: TableProps<IpData>['columns'] = useMemo(() => {
    return [
      {
        key: 'seq',
        dataIndex: 'seq',
        title: '序号',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: '名称',
        width: 100,
      },
      {
        key: 'ip',
        dataIndex: 'ip',
        title: 'ip',
        width: 200,
      },
      {
        key: 'operation',
        dataIndex: 'operation',
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <CopyButton size="small" type="text" text={record.ip}>
              复制
            </CopyButton>
          );
        },
      },
    ];
  }, []);

  return (
    <div>
      <div>
        <Button
          type="text"
          size="small"
          onClick={() => {
            store.openInEditor();
          }}
        >
          新增
        </Button>
        <Button
          type="text"
          size="small"
          style={{
            marginLeft: 6,
          }}
          onClick={() => {
            handleRefresh();
            message.success('刷新成功');
          }}
        >
          刷新
        </Button>
      </div>
      <div style={{ marginTop: 6 }}>
        <Table pagination={false} dataSource={state.ips} columns={columns} />
      </div>
    </div>
  );
};

export default CopyIp;
