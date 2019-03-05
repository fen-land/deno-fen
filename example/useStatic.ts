import { Server } from "../src/server.ts";
import { staticProcess } from "../src/tool/static.ts";

const s = new Server();

s.port = 1882;

// it will respond file from the path where deno run
s.setController(staticProcess({ root: "" }));

s.start();
