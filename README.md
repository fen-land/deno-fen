# Fen (a simple web framework for deno)

> It's still on development. Using deno v0.3.0.
> Welcome to join us or give your advice

  * [How 2 use](#how-2-use)
  * [About Context](#about-context)
  * [About Process](#about-process)
    + [Session Process](#session-process)
  * [About Tool](#about-tool)
    + [Router](#router)
    + [Logger](#logger)
    + [Static](#static)
  * [Update Log](#update-log)
  
## How 2 use

First you should install [deno](https://deno.land):

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Keep In Mind Now That You Are Using Github Url 2 Import Our Script!

We'll provide a better way to using our script after the work is done.

Test if it's work:

```typescript
import {Server} from 'https://github.com/fen-land/deno-fen/raw/master/src/server.ts';

const s = new Server();

s.port = 1882;

s.start();
```

Add your own controller 
```typescript
import {Server} from 'https://github.com/fen-land/deno-fen/raw/master/src/server.ts';

const s = new Server();

// pls keep in mind that you may add an async function as controller
s.setController(
    async (ctx) => {
        ctx.body = 'It\'s alive!';
    }
)

s.port = 1882;

s.start();
```

Then roll with the deno!
```bash
deno ${yours}.ts
⚠️  Deno requests network access to "listen". Grant? [yN] y
```

## About Context
Context is the only way now to pass data and get data.

```
{
 // ---- All from ServerRequest
  url,
  method,
  proto,
  headers,
  conn,
  reader,
  writer,
 // ----     
  request,    
  path, // url path without params and ip:port
  params, // Map<string, string>  params in url 
  data: new Map<string, any>(),
  body: "",// respond body
  status: 200,// respond status
  config: {
    disableRespond: false, // disable fen's respond
    disableBodyEncode: false, 
    disableContentType: false, 
    mimeType: "text/plain",
    charset: "utf-8" 
  },
  reqBody, // request body(after try to decode)
  originBody, // request body
  logger, // logger
  throw(code, message) // throw an http error
};
```

## About Process

process is a series of process between controller, you can develop your own process;

### Session Process
It's a simple session for Fen, using session(a map) to store data.

```typescript
import {Server} from 'https://github.com/fen-land/deno-fen/raw/master/src/server.ts';
import Session from 'https://github.com/fen-land/deno-fen/raw/master/src/process/session.ts'

const session = new Session();

const s = new Server();

s.addProcess(session.process);

s.port = 1882;

s.setController(
    async (ctx) => {
        const {session} = ctx;
        let c = session.get('c') || 1;

        if(ctx.path === '/') {
            session.set('c',  c + 1);
        }

        ctx.body = `It\'s alive for path '/' ${c} times in this browser!`;
    }
);

s.start();
```

## About Tool
Tool is a series function that help to do sth with controller

As you can see in `Session`

```typescript
const cookie = cookieReader(cookie);
setCookie.append('set-cookie', cookie2String(cookie));
```

### Router
In fen we provide a way to arrange route,
router tool.


This example shows many way to use router
```typescript
import { Server } from "../src/server.ts";
import { Router } from "../src/tool/router.ts";

const s = new Server();

s.port = 1882;

s.logger.changeLevel('ALL');

let mergeRouter = new Router('merge');

mergeRouter
  .get('/', async (ctx) => ctx.body = `${ctx.router.name} in ${ctx.router.route}`)
  .post('/', async (ctx) => ctx.body = `POST ${ctx.router.name} in ${ctx.router.route}`)
  .get('me', async (ctx) => ctx.body = `${ctx.router.name} in ${ctx.router.route}`);

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
  .use({ '/use': {get: async (ctx) => ctx.body = `use in ${ctx.router.route}`}})
  .merge('/merge', mergeRouter);
;

s.setController(router.controller);

s.start();
```

`Router` now support these method: 
```
    use(route: IRoute) // a way to add route
    // IRoute just like:
    // {[path]: {[method]: async function controller(cxt)}}
    merge(route: string, router:Router) // merge other router by add prefix route
    get
    post
    head
    put
    delete
    connect
    options
    trace
```

### Logger
In fen we provide a way to log info through logger we provide.
Logger now have 5 level for log to help you develop.
You can access them on `context.logger` .
```
    'ALL':  Display all log,
    'TRACE': trace some detail,
    'DEBUG': log to help you debug,
    'INFO': normal info for you,
    'WARN': simple warn,
    'ERROR': error that won't stop the server,
    'FATAL': once it happened, server won't work,
    'OFF': Disable all log
```

You can change log level by  `changeLevel`, logger also can access on `Server` instance
```typescript
logger.changeLevel('ALL');
```

### Static
We provide a tool for static file, 
it will generate a controller for server(or router).

```typescript
import {Server} from '../src/server.ts';
import {staticProcess} from "../src/tool/static.ts";

const s = new Server();

s.port = 1882;
// it will respond file from the path where deno run
s.setController(staticProcess({root: ''}));

s.start();
```

and here is some of the option you can fit in

```
{
    root: root path of the file,
    maxAge: (s),
    allowHidden: allow access hidden file,
    index: access if no file name provide 'index.html',
    immutable: immutable in cache-control,
    pathRender: (path) => afterpath, if you want do sth. with path
};
```

## Update Log

- v0.6.0 Mar 7, 2019
    - 💡 New http error handler
    - 💄 Decompose tool from each other, now tool only depend on Server context
- v0.5.3 Mar 5, 2019  
    - 💡 New router tool for controller
    - 💄 Add path render in static
    - 🎉 Using deno v0.3.0 now
- v0.5.1 Mar 4, 2019  
    - 💡 New static tool for file controller
- v0.5.0 Mar 4, 2019
    - 💡 New Logger for properly info presentation
- v0.4.0 Mar 1, 2019
    - 💡 Body is now auto encode
    - 💡 Add config to server
    - 💄 New content in context
    - 🎉 A bunch of example now is available
- v0.3.0 Feb 28, 2019 
    - 💄 Respond now is auto
- v0.2.0 Feb 27, 2019 
    - 💡 First Tool And Process
- v0.1.0 Feb 26, 2019 
    - 💡 Basic Server 
