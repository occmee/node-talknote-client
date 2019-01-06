import axios from 'axios';
import extend from 'deep-extend';
import querystring from 'querystring';
import winston from 'winston';

import { version as VERSION } from '../package.json';

export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
}

export class TalknoteClient {

  constructor(accessToken, options = {}) {
    this.version = VERSION;
    this.accessToken = accessToken;
    this.options = extend({
      refreshToken: undefined,
      clientId: undefined,
      clientSecret: undefined,
      agent: `node-talknote-client/${VERSION}`,
      apiUrl: 'https://eapi.talknote.com/api/v1/',
      headers: {},
      logger: undefined,
      logLevel: LogLevel.INFO,
      // maxRequestConcurrency: 3,
      // tls: undefined,
      // pageSize: 200,
      // rejectRateLimitedCalls: false,
    }, options);

    // Logging
    if (options.logger) {
      this.logger = options.logger;
    } else {
      this.logger = winston.createLogger({
        level: this.options.logLevel,
        format: winston.format.simple(),
        transports: new winston.transports.Console()
      });
    }

    this.axios = axios.create({
      baseURL: this.options.apiUrl,
      headers: extend({
        'User-Agent': this.options.agent,
        'X-TALKNOTE-OAUTH-TOKEN': this.accessToken,
      }, this.options.headers),
      // httpAgent: agentForScheme('http', agent),
      // httpsAgent: agentForScheme('https', agent),
      // transformRequest: [this.serializeApiCallOptions.bind(this)],
      // validateStatus: () => true, // all HTTP status codes should result in a resolved promise (as opposed to only 2xx)
      // maxRedirects: 0,
    });

    this.logger.info('constructor end.');
  }

  // async refresh() {
  //   refresh_token
  //   grant_type=refresh_token
  //
  // }

  async get(path, params = {}) {
    const response = await this.axios
      .get(path, { params })
      .catch(err => {
        this.logger.error(err);
        return { error: err };
      });
    return response.data || response;
  }

  async post(path, params = {}) {
    const response = await this.axios
      .post(path, querystring.stringify(params))
      .catch(err => {
        this.logger.error(err);
        return { error: err };
      });
    return response.data || response;
  }

  // -----

  async dm() {
    return await this.get(`/dm`);
  }

  async dm_list(id) {
    return await this.post(`/dm/list/${id}`);
  }

  async dm_unread(id) {
    return await this.get(`/dm/unread/${id}`);
  }

  async dm_post(id, message) {
    return await this.post(`/dm/post/${id}`, { message });
  }

  async group(id) {
    return await this.post(`/group/${id}`);
  }

  async group_list(id) {
    return await this.post(`/group/list/${id}`);
  }

  async group_unread(id) {
    return await this.post(`/group/unread/${id}`);
  }

  async group_post(id, message) {
    return await this.post(`/group/post/${id}`, { message });
  }

}
