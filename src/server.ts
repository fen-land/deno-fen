import { serve, ServerRequest } from "https://deno.land/x/std@v0.2.10/http/server.ts";

const Logger = console;

function req2ctx(request: ServerRequest) {
    const paramsRegx = /\?[^]*/;
    const {url, method, proto, headers, conn, r: reader, w: writer, respond} = request;
    let path = url, params = new Map<string, string>();
    
    if (paramsRegx.test(url)) {
        let {index} = url.match(paramsRegx);
        let p = url.substring(index + 1).split('&');

        path = url.substring(0, index);

        for (const param of p) {
            let [key, val] = param.split('=');

            params.set(key, val)
        }
    }

    return {url, method, proto, headers, conn, reader, writer, respond, request: request, path, params, data: new Map<string,any>(), body: false}
}

export class Server {
    private _port = 8088;
    private _ip = '0.0.0.0';

    get port() {
        return this._port;
    }
    set port(p) {
        this._port = p;
    }
    get ip() {
        return this.ip;
    }
    set ip(p) {
        this._ip = p;
    }

    private _serve = serve;

    _server;

    private _processes = [];

    addProcess(process) {
        if(this._processes.filter(e => e === process).length === 0) {
            this._processes.push(process);
        }
    }

    async _defaultController(req, context) {
        const statement = `You have success build a server with fen on  ${this._ip}:${this._port}\n
            Try set controller using setController method,
            Or try our route tool :)
        `

        req.respond({ body: new TextEncoder().encode(statement) });
    }

    private _controller;

    get controller() {
        if(this._controller) {
            return this._controller
        }

        return this._defaultController;
    }

    setController(controller: (request, context) => void) {
        this._controller = controller;
    }

    async start() {
        this._server = serve(`${this._ip}:${this._port}`);

        Logger.log(`Server now listen on ${this._ip}:${this._port}`);

        for await (const req of this._server) {
            let context = req2ctx(req);

            Logger.log(context.path, context.headers, context.params)

            if(this._processes.length) {
                for (const process of this._processes) {
                    try {
                        context = await process(context);
                    } catch (err) {
                        Logger.error('While process', err)
                    }
                }
            }

            try {
                this.controller(context)
            } catch (err) {
                Logger.error('While Controller', err)
            }

            const {body, headers} = context;
            const respondOption = {};

            if(body) {respondOption['body'] = body}
            if(headers) {respondOption['headers'] = headers}

            if(Object.keys(respondOption).length > 0) {
                await req.respond(respondOption);
            }
            
        }
    }
}
