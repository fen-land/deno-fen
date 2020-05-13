import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Server } from "../server.ts";

Deno.test({
  name: "[Server] Server Hello World",
  ignore: true,
  async fn() {
    const s = (new Server());

    s.port = 1882;

    s.start().then();

    let c = await fetch("http://localhost:1882/string");

    assertEquals(c.status, 200);
    const res = new TextDecoder().decode(await c.arrayBuffer());
    assertEquals(
      res,
      `You have success build a server with fen on  0.0.0.0:1882

            Try set controller using setController method,
            Or try our route tool :)
        `,
    );

  },
});
