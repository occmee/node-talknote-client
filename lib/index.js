const fetch = require('isomorphic-fetch');
const extend = require('deep-extend');
const querystring = require('querystring');
const winston = require('winston');

const VERSION = require('../package.json').version;

const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class TalknoteClient {

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

  async _handleResponse(response) {
    const resJson = await response.json();
    this.logger.debug('_handleResponse', resJson);
    return resJson;
  };

  _handleError(error) {
    this.logger.error('_handleError', error);
    return { error };
  };

  _request(path, req) {
    this.logger.debug('_request', { path, req });
    const url = `${this.options.apiUrl}${path}`;
    return fetch(url, req)
      .then(this._handleResponse.bind(this))
      .catch(this._handleError.bind(this));
  }

  async get(path, params = {}) {
    const req = {
      method: 'GET',
      headers: this.headers
    };
    const query = querystring.stringify(params);
    return this._request(query ? `${path}?${query}` : path, req);
  }

  async post(path, params = {}) {
    const req = {
      method: 'POST',
      headers: this.headers,
      body: querystring.stringify(params),
    };
    return this._request(path, req);
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

module.exports = TalknoteClient;
