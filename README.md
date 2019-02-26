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
        await req.respond({
            body: new TextEncoder().encode('It\'s alive!'),
        })
    }
)

s.port = 1882;

s.start();
```