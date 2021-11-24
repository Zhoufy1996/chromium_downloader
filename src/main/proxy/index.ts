import AnyProxy from 'anyproxy';
import rule from './rule';

class ProxyService {
  proxyServer: AnyProxy.ProxyServer | undefined;

  options: AnyProxy.ProxyOptions;

  constructor() {
    this.options = {
      port: 8001,
      rule,
      webInterface: {
        enable: true,
        webPort: 8002,
      },
      throttle: 10000,
      forceProxyHttps: true,
      dangerouslyIgnoreUnauthorized: true,
      wsIntercept: false, // 不开启websocket代理
      silent: false,
    };
  }

  start() {
    if (this.proxyServer == null) {
      this.proxyServer = new AnyProxy.ProxyServer(this.options);
    }
  }

  close() {
    if (this.proxyServer) {
      this.proxyServer.close();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  disableGlobalProxy() {
    AnyProxy.utils.systemProxyMgr.disableGlobalProxy();
  }

  enableGlobalProxy() {
    AnyProxy.utils.systemProxyMgr.enableGlobalProxy(
      '127.0.0.1',
      this.options.port
    );
  }

  updateOptions(inputOptions: AnyProxy.ProxyOptions) {
    this.options = {
      ...this.options,
      ...inputOptions,
    };
  }
}

let proxyService: null | ProxyService;

// 单例
const getProxyService = () => {
  if (proxyService) {
    return proxyService;
  }

  return new ProxyService();
};

export default getProxyService();
