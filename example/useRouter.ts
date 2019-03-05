import { Server } from "../src/server.ts";
import { Router } from "../src/tool/router.ts";

const s = new Server();

s.port = 1882;

s.logger.changeLevel('ALL');

let mergeRouter = new Router('merge');

mergeRouter
  .get('', async (ctx) => ctx.body = `${ctx.router.name} in ${ctx.router.route}`)
  .post('', async (ctx) => ctx.body = `POST ${ctx.router.name} in ${ctx.router.route}`)
  .get('me/:name', async (ctx) => ctx.body = `${ctx.router.name} dis ${ctx.router.params.name} in ${ctx.router.route}`);

let router = new Router();

router
  .get('/:id', async (ctx) => {
  ctx.body = `we have ${JSON.stringify(ctx.router.params)} in ${ctx.router.route}`
})
  .get('/:id/:name', async (ctx) => {
  ctx.body = `we have ${JSON.stringify(ctx.router.params)} in ${ctx.router.route}`
})
  .get('/hello/:name', async (ctx) => {
    ctx.body = `hello ${ctx.router.params.name} in ${ctx.router.route}`
  })
  .use({
    '/use': {get: async (ctx) => ctx.body = `use in ${ctx.router.route}`}
  })
  .merge('/merge', mergeRouter);
;

s.setController(router.controller);

s.start();
