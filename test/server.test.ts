import { runTests, test } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {Server} from "../server.ts";

test({
  name: '[Server] Server Hello World',
  async fn() {
    const s = (new Server());

    s.port = 1882;

    s.start();

    let c = await fetch('http://localhost:1882/string');

    assertEquals(c.status, 200);
    assertEquals(new TextDecoder().decode(await c.arrayBuffer()),
      `You have success build a server with fen on  0.0.0.0:1882

            Try set controller using setController method,
            Or try our route tool :)
        `);

    setTimeout(() => Deno.exit(), 10);
  }
});
