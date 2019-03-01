/**
 * Turn cookie in to string string map
 * @param cookie
 */
export function cookieReader(cookie: string) {
    const result = new Map<string, string>();
    const cookieStrs = cookie.split(';');

    for (const str of cookieStrs) {
        let [key, value] = str.trim().split('=');

        result.set(key, value);
    }

    return result;
}

/**
 * Turn string map back into cookie
 * @param cookie
 */
export function cookie2String(cookie: Map<string, string>) {
    let result = "";
    cookie.forEach((v, k) => result += v ? `${k}=${v}; ` : `${k}; `);
    result.trim().slice(0,-1);
    return result;
}