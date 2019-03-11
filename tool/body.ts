/**
 * tool/body.ts
 * Body evolved tool are save here
 * @author DominicMing
 */

// this is a global encoder, using by all
const encoder = new TextEncoder();

/**
 * encode body if body type supported
 * @param body
 * @return Uint8Array
 */
export function bodyEncoder(body) {
  let result = encoder.encode("");

  if (body instanceof Uint8Array) {
    result = body;
  } else if (typeof body === "string") {
    result = encoder.encode(body);
  } else if (typeof body === "object") {
    let jsonStr = "";
    try {
      jsonStr = JSON.stringify(body);
    } catch (e) {
      console.warn("unable to encode body, it's not in right form");
    }
    result = encoder.encode(jsonStr);
  }

  return result;
}

/**
 * decode body if the content-type supported
 * @param body {Uint8Array}
 * @param header {Headers}
 * @return {string|Uint8Array|Object}
 */
export function bodyDecoder(body: Uint8Array, header: Headers) {
  if (header.has("content-type")) {
    let ct = header.get("content-type");
    let charset = ct.match(/charset="([^]*)"/i);
    let decoder = new TextDecoder(charset ? charset[1] : "utf-8");

    if (/application\/x-www-form-urlencoded/i.test(ct)) {
      let ctt = decoder.decode(body);
      let obj = {};

      ctt.split("&").map(e => {
        let [k, v] = e.trim().split("=");
        let key = decodeURIComponent(k);
        obj[key] = decodeURIComponent(v || "");
      });

      return obj;
    }

    if (/application\/json/i.test(ct)) {
      let obj = {};
      let ctt = decoder.decode(body);

      try {
        obj = JSON.parse(ctt);
      } catch (e) {
        console.error("Error while parse json", e);
      }

      return obj;
    }

    if (ct.includes("text")) {
      return decoder.decode(body);
    }

    return body;
  }
}

/**
 * generate error body
 * @param status {number}
 * @param info {string}
 * @return string
 */
export function errorBodyGen(status: number, info: string) {
  return `
<html lang="en">
    <head>
        <title>Fen - ${status}</title>
    </head>
    <body>
        <h1>Error ${status} !</h1>
        <p>${info}</p>
    </body>
</html>
    `;
}
