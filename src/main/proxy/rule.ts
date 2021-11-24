/* eslint-disable require-yield */
import { RuleModule } from 'anyproxy';
import httpProxyAgent from 'http-proxy-agent';
import httpsProxyAgent from 'https-proxy-agent';
import config from './config';

const rule: RuleModule = {
  summary: 'my customized rule for AnyProxy',
  async beforeSendResponse() {
    return null;
  },

  async beforeSendRequest(requestDetail) {
    if (
      config.whitelist.some(
        (whiteUrl) => requestDetail.url.indexOf(whiteUrl) >= 0
      )
    ) {
      return null;
    }

    const newRequestOptions = requestDetail.requestOptions;

    const agent =
      requestDetail.protocol === 'http'
        ? httpProxyAgent(config.downstream)
        : httpsProxyAgent(config.downstream);

    newRequestOptions.agent = agent;
    return {
      requestOptions: newRequestOptions,
    };
  },

  async onError(requestDetail, error) {
    console.log(`onError: ${error}`);
    return null;
  },

  async onConnectError(requestDetail, error) {
    console.log(`onConnectError: ${error}`);
    return null;
  },
};

export default rule;
