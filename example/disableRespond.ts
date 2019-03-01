import {Server} from '../src/server.ts';

const s = new Server();
// when you decide to respond by your own, pls try disableRespond in config
// if you're using process involving header change, please add header to complete the process
s.setController(
    async (ctx) => {
        const {request, config, header} = ctx;
        config.disableRespond = true;
        request.respond({body: new TextEncoder().encode('It\'s alive!'), header})
    }
);

s.port = 1882;

s.start();