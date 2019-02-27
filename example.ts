import {Server} from './src/server.ts';

const s = new Server();

s.port = 1882;

s.setController(
    async (req, ctx) => {
        await req.respond({
            body: new TextEncoder().encode('It\'s alive!'),
        })
    }
)

s.start();