import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { cookie2String, cookieReader } from "../../tool/cookie.ts";

Deno.test({
  name: "[Tool/Cookie] Cookie tool test",
  fn() {
    const ce =
      "ignored_unsupported_browser_notice=false; has_recent_activity=1";
    assertEquals(cookieReader(ce).get("has_recent_activity"), "1");
    assertEquals(cookie2String(cookieReader(ce)), ce);
  },
});
