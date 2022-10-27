const Axios = require('axios').default;
const https = require('https');
const http = require('http');
const qs = require('qs');
const Constants = require('./Constants');

class SessionBuilder {
  /**
   * It creates a new instance of Axios
   * @returns An Axios instance
   */
  static create() {
    return Axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'comma' }),
      headers: { 
        'User-Agent': Constants.USERAGENT,
        'Content-Encoding': 'Accept-Encoding: gzip, deflate, br',
      },
    });
  }
}

module.exports = SessionBuilder;
