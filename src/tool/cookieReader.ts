export function cookieReader(headers: Headers) {
    let result = new Map<string, string>();

    if (headers.has('cookie')) {
        let cookie = headers.get('cookie');
        const cookieStrs = cookie.split(';');

        for(const str of cookieStrs) {
            let [key, value] = str.trim().split('=');

            result.set(key, value);
        }
    }
    return result;
}

export function cookie2String(cookie: Map<string, string>) {
    let result = ""
    cookie.forEach((v, k) => result += `${k}=${v}; `);
    return result;
}