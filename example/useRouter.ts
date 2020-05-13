import { Server, IContext } from "../server.ts";
import { Router } from "../tool/router.ts";

const s = new Server();

s.port = 1882;

s.logger.changeLevel("ALL");

let mergeRouter = new Router("merge");

mergeRouter
  .get(
    "",
    async (ctx) => {
      (ctx.body = `${ctx.data.get("router").name} in ${
        ctx.data.get("router").route
      }`);
    },
  )
  .post(
    "",
    async (ctx: IContext) => {
      (ctx.body = `POST ${ctx.data.get("router").name} in ${
        ctx.data.get("router").route
      }`);
    },
  )
  .get(
    "me/:name",
    async (ctx: IContext) => {
      (ctx.body = `${ctx.data.get("router").name} dis ${
        ctx.data.get("router").params.name
      } in ${ctx.data.get("router").route}`);
    },
  );

let router = new Router();

router
  .get("/:id", async (ctx) => {
    ctx.body = `we have ${JSON.stringify(ctx.data.get("router").params)} in ${
      ctx.data.get("router").route
    }`;
  })
  .get("/:id/:name", async (ctx) => {
    ctx.body = `we have ${JSON.stringify(ctx.data.get("router").params)} in ${
      ctx.data.get("router").route
    }`;
  })
  .get("/hello/:name", async (ctx) => {
    ctx.body = `hello ${ctx.data.get("router").params.name} in ${
      ctx.data.get("router").route
    }`;
  })
  .use({
    "/use": {
      get: async (ctx) => {
        (ctx.body = `use in ${ctx.data.get("router").route}`);
      },
    },
  })
  .merge("/merge", mergeRouter);
s.setController(router.controller);

s.start();
