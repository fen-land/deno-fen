import {Server} from 'https://github.com/mxz96102/deno-fen/raw/master/src/server.ts';

const s = new Server();

s.setController(
    async (req, ctx) => {
        await req.respond({
            body: new TextEncoder().encode('It\'s alive!'),
        })
    }
)

s.start();