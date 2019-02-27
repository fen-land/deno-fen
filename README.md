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
    async (req, ctx) => {
        ctx.body = new TextEncoder().encode('It\'s alive!'),
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
        const {headers, session} = ctx;
        let c = 0;

        if(ctx.path === '/') {
            console.log('!-!', session.get('c'))
            if(session.get('c')) {
                c = session.get('c');
                session.set('c', session.get('c') + 1) ;    
            } else {
                session.set('c', 1);
            }
        }

        ctx.body = new TextEncoder().encode(`It\'s alive for path '/' ${c} times in this browser!`);
    }
)

s.start();
```

### About Tool
Tool is a series function that help to do sth with controller

As you can see in Session

```typescript
        const cookie = cookieReader(headers);
        headers.append('set-cookie', cookie2String(cookie));
```