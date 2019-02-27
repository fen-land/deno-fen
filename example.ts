import {Server} from './src/server.ts';
import Session from './src/process/session.ts'

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