const Axios = require('axios').default;
const https = require('https');
const http = require('http');
const qs = require('qs');

class SessionBuilder {
  /**
   * Create a new Axios instance with the default configuration, but with the http
   * and https agents set to keepAlive: true, and the paramsSerializer set to
   * qs.stringify with the arrayFormat set to repeat.
   * @returns An Axios instance with the following configuration:
   *   - httpAgent: A new http.Agent instance with keepAlive set to true
   *   - httpsAgent: A new https.Agent instance with keepAlive set to true
   *   - paramsSerializer: A function that serializes the params object into a
   * query string
   */
  static create() {
    return Axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
    });
  }
}

module.exports = SessionBuilder;
