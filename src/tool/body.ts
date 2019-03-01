const encoder = new TextEncoder();

export function bodyEncoder(body) {
    let result = encoder.encode('');

    if (body instanceof Uint8Array) {
        result = body;
    } else if (typeof body === 'string') {
        result = encoder.encode(body);
    } else if (typeof body === "object") {
        let jsonStr = '';
        try {
            jsonStr = JSON.stringify(body)
        } catch (e) {
            console.warn('unable to encode body, it\'s not in right form')
        }
        result = encoder.encode(jsonStr);
    }

    return result;
}
