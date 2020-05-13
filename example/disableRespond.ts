import { Server, IContext } from "../server.ts";

const s = new Server();
// when you decide to respond by your own, pls try disableRespond in config
// if you're using process involving header change, please add header to complete the process
s.setController(async (ctx: IContext) => {
  const { request, config, headers } = ctx;
  config.disableRespond = true;
  request.respond({ body: new TextEncoder().encode("It's alive!"), headers });
});

s.port = 1882;

s.start();
