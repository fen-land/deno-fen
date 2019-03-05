import { Server } from "../src/server.ts";

const s = new Server();

s.setController(async ctx => {
  ctx.config.mimeType = "application/json";
  ctx.body = {
    now: "you",
    can: ["see"],
    me: 2
  };
});

s.port = 1882;

s.start();
