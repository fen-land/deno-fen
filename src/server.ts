import { serve } from "https://deno.land/x/std@v0.2.10/http/server.ts";

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

        console.log(`Server now listen on ${this._ip}:${this._port}`)

        for await (const req of this._server) {
            let context = {
                request: req,
                respond: req.respond
            }

            if(this._processes.length) {
                for (const process of this._processes) {
                    context = await process(context);
                }
            }

            this.controller(req, context)
        }
    }
}
