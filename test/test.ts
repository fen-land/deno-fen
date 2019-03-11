import { runTests } from "https://deno.land/std/testing/mod.ts";

import './tool/body.test.ts'
import './tool/cookie.test.ts'
import './server.test.ts'

runTests();