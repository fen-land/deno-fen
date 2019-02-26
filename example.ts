import {Server} from './src/server.ts';

const s = new Server();

s.setController(
    async (req, ctx) => {
        await req.respond({
            body: new TextEncoder().encode('new controller'),
        })
    }
)

s.start();