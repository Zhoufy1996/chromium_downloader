import React, { useCallback, useEffect, useState } from 'react';
import { getProxySettings, ProxySettings } from 'get-proxy-settings';
import { Button, Descriptions, message } from 'antd';

const SystemProxy = () => {
  interface State {
    proxySettings: ProxySettings;
  }

  const [state, setState] = useState<State>({
    proxySettings: {},
  });

  const getProxy = useCallback(async () => {
    const proxySettings = await getProxySettings();
    setState((pre) => {
      return {
        ...pre,
        proxySettings,
      };
    });
  }, []);

  const handleRefresh = useCallback(() => {
    getProxy();
    message.success('刷新成功');
  }, [getProxy]);

  useEffect(() => {
    getProxy();
  }, [getProxy]);

  const { proxySettings } = state;

  return (
    <div>
      <Descriptions
        title="system proxy"
        bordered
        extra={
          <Button type="text" onClick={handleRefresh}>
            刷新
          </Button>
        }
      >
        <Descriptions.Item label="http">
          {proxySettings.http?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="https">
          {proxySettings.https?.toString()}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default SystemProxy;
