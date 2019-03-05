import {
  serve,
  ServerRequest
} from "https://deno.land/x/std@v0.3.0/http/server.ts";
import { bodyEncoder, bodyDecoder } from "./tool/body.ts";
import { Logger } from "./tool/logger.ts";

interface IRespondConfig {
  disableRespond: boolean;
  disableBodyEncode: boolean;
  disableContentType: boolean;
  mimeType: string;
  charset: string;
}

/**
 * create context from request
 * @param request
 * @return context {IContext}
 */
async function req2ctx(request: ServerRequest, logger) {
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
    logger
  };
}

export class Server {
  port = 8088;
  ip = "0.0.0.0";

  _server;

  private _processes = [];

  private _event_pool = new Map<string, Array<PromiseLike<any>>>();

  logger = new Logger();

  addProcess(process) {
    if (this._processes.filter(e => e === process).length === 0) {
      this._processes.push(process);
    }
  }

  private async _defaultController(ctx) {
    ctx.body = `You have success build a server with fen on  ${this.ip}:${
      this.port
    }\n
            Try set controller using setController method,
            Or try our route tool :)
        `;
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

    for await (const req of this._server) {
      let context = await req2ctx(req, logger);

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
          }
        }
      }

      try {
        await this.controller(context);
      } catch (err) {
        logger.error("While Controller", err);
      }

      const { body, headers, status, config } = context;
      const respondOption = {};

      if (!config.disableRespond) {
        if (!config.disableBodyEncode) {
          respondOption["body"] = bodyEncoder(body);
        }

        if (headers) {
          respondOption["headers"] = headers;
        }

        if (!config.disableContentType) {
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
  }
}
