import {Server} from '../src/server.ts';

const s = new Server();

s.setController(
    async (ctx) => {
        ctx.body = 'It\'s alive!'
    }
);

s.port = 1882;

s.start();