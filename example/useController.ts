import {Server} from '../src/server.ts';

const s = new Server();

s.setController(
    async (ctx) => {
        ctx.body = new TextEncoder().encode('It\'s alive!')
    }
);

s.port = 1882;

s.start();