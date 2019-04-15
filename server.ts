import {
  serve,
  ServerRequest
} from "https://deno.land/x/std@v0.3.4/http/server.ts";
import { bodyEncoder, bodyDecoder, errorBodyGen } from "./tool/body.ts";
import { Logger } from "./tool/logger.ts";

/**
 * Http error for throw
 */
class HttpError extends Error {
  code = 0;
  message = "";

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

/**
 * respond config
 */
export interface IRespondConfig {
  disableRespond: boolean;
  disableBodyEncode: boolean;
  disableContentType: boolean;
  mimeType: string;
  charset: string;
}

export interface IContext {
  url: string;
  method: string;
  proto: ServerRequest['proto'];
  headers: Headers;
  conn: ServerRequest['conn'];
  reader: ServerRequest['r'];
  writer: ServerRequest['w'];
  request: ServerRequest;
  path: string;
  params: Map<string, string>;
  data: Map<string, any>;
  body: any;
  status: number;
  config: any;
  reqBody: any;
  originBody: any;
  logger: Logger;
  throw: (code: number, msg: string) => void;
}

/**
 * create context from request
 * @param request
 * @param server
 * @return context {IContext}
 */
async function req2ctx(
  request: ServerRequest,
  server: Server
): Promise<IContext> {
  // match params in url
  const paramsRegx: RegExp = /\?[^]*/;
  const { url, method, proto, conn, r: reader, w: writer } = request;
  const originBody = await request.body();
  const reqBody = bodyDecoder(originBody, request.headers);
  let path = url,
    params = new Map<string, string>();
  const headers = new Headers();
  const config: IRespondConfig = {
    disableRespond: false,
    disableBodyEncode: false,
    disableContentType: false,
    mimeType: "text/plain",
    charset: "utf-8"
  };

  // read two part in url (path, param)
  if (paramsRegx.test(url)) {
    let { index } = url.match(paramsRegx);
    let p = url.substring(index + 1).split("&");

    path = url.substring(0, index);

    for (const param of p) {
      let [key, val] = param.split("=");

      params.set(key, val);
    }
  }

  return {
    url,
    method,
    proto,
    headers,
    conn,
    reader,
    writer,
    request,
    path,
    params,
    data: new Map<string, any>(),
    body: "",
    status: 200,
    config,
    reqBody,
    originBody,
    logger: server.logger,
    throw: (code, msg) => {
      throw new HttpError(code, msg);
    }
  };
}

export class Server {
  port = 8088;
  ip = "0.0.0.0";
  _server;
  logger = new Logger();
  __test_run__ = false;

  private _processes = [];

  private async _defaultController(ctx) {
    ctx.body = `You have success build a server with fen on  ${this.ip}:${
      this.port
    }\n
            Try set controller using setController method,
            Or try our route tool :)
        `;
  }

  addProcess(process) {
    if (this._processes.filter(e => e === process).length === 0) {
      this._processes.push(process);
    }
  }

  private _controller;

  get controller() {
    if (this._controller) {
      return this._controller;
    }

    return this._defaultController;
  }

  setController(controller: (context) => void) {
    this._controller = controller;
  }

  async start() {
    let logger = this.logger;

    this._server = serve(`${this.ip}:${this.port}`);

    logger.info(`Server now listen on ${this.ip}:${this.port}`);

    try {
      for await (const req of this._server) {
        let context = await req2ctx(req, this);
        let errorBody = null;

        if (this._processes.length) {
          for (const process of this._processes) {
            try {
              let result = await process(context);
              if (result) {
                context = result;
              } else {
                logger.error("Process didn't return context properly", process);
              }
            } catch (err) {
              logger.error("While process", err);
              if (err.code) {
                errorBody = errorBodyGen(err.code, err.message);
                context.status = err.code;
                context.body = errorBody;
              }
            }
          }
        }

        if (!errorBody) {
          try {
            await this.controller(context);
          } catch (err) {
            logger.error("While Controller", err);
            if (err.code) {
              errorBody = errorBodyGen(err.code, err.message);
              context.status = err.code;
              context.body = errorBody;
            }
          }
        }

        const {body, headers, status, config} = context;
        const respondOption = {};

        if (!config.disableRespond) {
          if (!config.disableBodyEncode) {
            respondOption["body"] = bodyEncoder(body);
          }

          if (headers) {
            respondOption["headers"] = headers;
          }

          if (!config.disableContentType) {
            if (errorBody) {
              config.mimeType = "text/html";
            }

            if (config.charset) {
              headers.set(
                "content-type",
                `${config.mimeType}; charset="${config.charset}"`
              );
            } else {
              headers.set("content-type", `${config.mimeType}`);
            }
          }

          if (status) {
            respondOption["status"] = status;
          }
          await req.respond(respondOption);
        }
      }
    } catch (e) {
      logger.error(e);
      return -1;
    }
  }
}
