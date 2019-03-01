import {Server} from '../src/server.ts';

const s = new Server();

s.port = 1882;

s.start();