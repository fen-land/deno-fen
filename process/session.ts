/**
 * process/session.ts
 * Session process for fen
 * @author DominicMing
 */

import { cookieReader, cookie2String } from "../tool/cookie.ts";

/**
 * session config
 */
interface ISessionConfig {
  name?: string;
  maxAge?: number;
  httpOnly?: boolean;
  forceSetHeader?: boolean;
  secure: boolean;
}

/**
 * get random id
 * @return string
 */
function getRandomId() {
  return Math.random()
    .toString(16)
    .slice(-7);
}

/**
 * Session class
 */
export class Session {
  pool = new Map<string, Map<string, any>>();
  config: ISessionConfig = {
    name: "fen-session",
    maxAge: 86400000,
    httpOnly: true,
    forceSetHeader: false,
    secure: false
  };

  constructor(config?) {
    this.config = { ...this.config, ...config };
  }

  process = async context => {
    const { headers } = context.request;
    const { logger } = context;
    const cookieStr = headers.has("cookie") ? headers.get("cookie") : "";
    let { name, secure, forceSetHeader, httpOnly, maxAge } = this.config;
    const cookie = cookieReader(cookieStr);
    const setCookie = new Map<string, string>();
    const time = +new Date();
    let id;

    if (!cookie.has(name)) {
      id = getRandomId();
      forceSetHeader = true;
      logger.trace("[SESSION] create new session id for this request;");
    } else {
      id = cookie.get(name);
    }

    if (!this.pool.has(id)) {
      this.pool.set(id, new Map<string, any>());
      logger.trace("[SESSION] create new session id for this request;");
      forceSetHeader = true;
    }

    const pool = this.pool.get(id);

    if (forceSetHeader) {
      setCookie.set(name, id);
      if (httpOnly) {
        logger.trace("[SESSION] set httpOnly;");
        setCookie.set("HttpOnly", "");
      }
      if (secure) {
        logger.trace("[SESSION] setSecure;");
        setCookie.set("Secure", "");
      }
      if (maxAge) {
        setCookie.set("Max-Age", Math.round(maxAge / 1000).toString());
        setCookie.set("Expires", new Date(time + maxAge).toUTCString());
        logger.trace(`[SESSION] this cookie will last ${maxAge}ms;`);
      }
      context.headers.append("set-cookie", cookie2String(setCookie));
      logger.trace(`[SESSION] set-cookie is ${cookie2String(setCookie)};`);
    }

    if (pool) {
      context.data.set("session", pool);
    }

    return context;
  };
}
