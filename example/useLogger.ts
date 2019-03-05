import { Server } from "../src/server.ts";
import Session from "../src/process/session.ts";

const session = new Session();

const s = new Server();

s.addProcess(session.process);

s.port = 1882;

// You can change logger level for more info
s.logger.changeLevel("ALL");

s.setController(async ctx => {
  const { session, logger } = ctx;
  let c = session.get("c") || 1;

  if (ctx.path === "/") {
    session.set("c", c + 1);
    logger.info("you will see c =", c, "in this controller");
  }

  ctx.body = `It\'s alive for path '/' ${c} times in this browser!`;
});

s.start();
