const Axios = require("axios").default;
const https = require("https");
const http = require("http");
const { parse, stringify } = require("qs");
const Constants = require("./Constants");
const { default: axiosRetry } = require("axios-retry");

class SessionBuilder {
  /**
   * It creates a new instance of Axios
   * @returns An Axios instance
   */
  static create() {
    const session = Axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      paramsSerializer: {
        serialize: (p) => stringify(p, { arrayFormat: "comma" }),
        encode: parse,
      },
      headers: {
        "User-Agent": Constants.USERAGENT,
        "Content-Encoding": "Accept-Encoding: gzip, deflate, br",
      },
    });

    axiosRetry(session, {
      retries: 0,
      retryDelay: (retries) => retries * 500,
    });

    return session;
  }
}

module.exports = SessionBuilder;
