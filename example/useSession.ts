import { Server } from "../src/server.ts";
import Session from "../src/process/session.ts";

const session = new Session();

const s = new Server();

s.addProcess(session.process);

s.port = 1882;

s.setController(async ctx => {
  const { session } = ctx;
  let c = session.get("c") || 1;

  if (ctx.path === "/") {
    session.set("c", c + 1);
  }

  ctx.body = `It\'s alive for path '/' ${c} times in this browser!`;
});

s.start();
