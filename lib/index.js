import fetch from 'isomorphic-fetch';
import extend from 'deep-extend';
import querystring from 'querystring';
import winston from 'winston';

import { version as VERSION } from '../package.json';

export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export class TalknoteClient {

  constructor(accessToken, options = {}) {
    this.version = VERSION;
    this.accessToken = accessToken;
    this.options = extend({
      refreshToken: undefined,
      clientId: undefined,
      clientSecret: undefined,
      apiUrl: 'https://eapi.talknote.com/api/v1',
      logger: undefined,
      logLevel: LogLevel.INFO,
    }, options);

    // Request Header
    this.headers = extend({
      'User-Agent': `node-talknote-client/${VERSION}`,
      'X-TALKNOTE-OAUTH-TOKEN': this.accessToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    }, options.headers);

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

    this.logger.info('constructor end.');
  }

  // async refresh() {
  //   refresh_token
  //   grant_type=refresh_token
  //
  // }

  _handleError(error) {
    return { error };
  };

  _process(path, req) {
    this.logger.debug('_process', { path, req });
    const url = `${this.options.apiUrl}${path}`;
    return fetch(url, req)
      .then(res => res.json())
      .catch(this._handleError);
  }

  async get(path, params = {}) {
    const req = {
      method: 'GET',
      headers: this.headers
    };
    const query = querystring.stringify(params);
    return this._process(query ? `${path}?${query}` : path, req);
  }

  async post(path, params = {}) {
    const req = {
      method: 'POST',
      headers: this.headers,
      body: querystring.stringify(params),
    };
    return this._process(path, req);
  }

  // -----

  async dm() {
    return await this.get(`/dm`);
  }

  async dm_list(id) {
    // Notes: ドキュメントでは POST になっているが、GET が正しいっぽい
    return await this.get(`/dm/list/${id}`);
  }

  async dm_unread(id) {
    return await this.get(`/dm/unread/${id}`);
  }

  async dm_post(id, message) {
    return await this.post(`/dm/post/${id}`, { message });
  }

  async group() {
    // Notes: ドキュメントでは POST `/group/${group_id}` になっているが、id は必要ないっぽい
    return await this.post(`/group`);
  }

  async group_list(id) {
    // Notes: ドキュメントでは POST になっているが、GET が正しいっぽい
    return await this.get(`/group/list/${id}`);
  }

  async group_unread(id) {
    // Notes: ドキュメントでは POST になっているが、GET が正しいっぽい
    return await this.get(`/group/unread/${id}`);
  }

  async group_post(id, message) {
    return await this.post(`/group/post/${id}`, { message });
  }

}
