# Fen (a simple web framework for deno)

> it's still on development

> welcome to join us or give your advice

## How 2 use

First you should install [deno](https://deno.land):

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Keep In Mind Now That You Are Using Github Url 2 Import Our Script!

We'll provide a better way to using our script after the work is done.

Test if it's work:

```typescript
import {Server} from 'https://github.com/mxz96102/deno-fen/raw/master/src/server.ts';

const s = new Server();

s.port = 1882;

s.start();
```

Add your own controller 
```typescript
import {Server} from 'https://github.com/mxz96102/deno-fen/raw/master/src/server.ts';

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

## About Process

process is a series of process between controller, you can develop your own process;

### Session Process
It's a simple session for Fen, using session(a map) to store data.

```typescript
import {Server} from 'https://github.com/mxz96102/deno-fen/raw/master/src/server.ts';
import Session from 'https://github.com/mxz96102/deno-fen/raw/master/src/process/session.ts'

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

### About Tool
Tool is a series function that help to do sth with controller

As you can see in `Session`

```typescript
const cookie = cookieReader(cookie);
setCookie.append('set-cookie', cookie2String(cookie));
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

## Update Log

- v0.1.0 Feb 26, 2019 
    - 💡 Basic Server 
- v0.2.0 Feb 27, 2019 
    - 💡 First Tool And Process
- v0.3.0 Feb 28, 2019 
    - 💄 Respond now is auto
- v0.4.0 Mar 1, 2019
    - 💡 Body is now auto encode
    - 💡 Add config to server
    - 💄 New content in context
    - 🎉 A bunch of example now is available
- v0.5.0 Mar 4, 2019
    - 💡 New Logger for properly info presentation