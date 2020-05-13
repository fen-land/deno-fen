import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { bodyDecoder, bodyEncoder, errorBodyGen } from "../../tool/body.ts";

Deno.test({
  name: "[Tool/Body] Body Encode",
  fn() {
    const nUI8 = new Uint8Array([1]);
    assertEquals(bodyEncoder(nUI8), nUI8);

    const sUI8 = (new TextEncoder()).encode("what is that");
    assertEquals(bodyEncoder("what is that"), sUI8);

    const jUI8 = (new TextEncoder()).encode(JSON.stringify({ j: 1, b: 2 }));
    assertEquals(bodyEncoder({ j: 1, b: 2 }), jUI8);
  },
});

Deno.test({
  name: "[Tool/Body] Body Decode",
  fn() {
    const nUI8 = new Uint8Array([1]);
    assertEquals(bodyDecoder(nUI8, new Headers()), nUI8);

    const sUI8 = (new TextEncoder()).encode("what is that");
    const h1 = new Headers();
    h1.set("content-type", "text/plain");
    assertEquals(bodyDecoder(sUI8, h1), "what is that");

    const jUI8 = (new TextEncoder()).encode(JSON.stringify({ j: 1, b: 2 }));
    const h2 = new Headers();
    h2.set("content-type", "application/json");
    assertEquals(bodyDecoder(jUI8, h2), { j: 1, b: 2 });
  },
});

Deno.test({
  name: "[Tool/Body] Error Body Generate",
  fn() {
    assertEquals(
      errorBodyGen(404, "Not Found"),
      `
<html lang="en">
    <head>
        <title>Fen - 404</title>
    </head>
    <body>
        <h1>Error: 404!</h1>
        <p>Not Found</p>
    </body>
</html>
    `,
    );
  },
});
