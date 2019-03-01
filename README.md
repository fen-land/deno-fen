# Fen (a simple web framework for deno)

> it's still on development

> welcome to join us or give your advice

## How 2 use
Ttest if it's work:

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

s.setController(
    async (ctx) => {
        ctx.body = 'It\'s alive!';
    }
)

s.port = 1882;

s.start();
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

As you can see in Session

```typescript
const cookie = cookieReader(cookie);
setCookie.append('set-cookie', cookie2String(cookie));
```