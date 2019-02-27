import {cookieReader, cookie2String} from '../tool/cookieReader.ts';

function getRandomId() {
    return Math.random().toString(16).slice(-7);
}

export default class Session {
    pool = new Map<string, Map<string, any>>();
    timePool = new Map<string, Date>();
    
    process = async(context) => {
        const {headers} = context.request;
        const cookie = cookieReader(headers);
        let id;

        if(!cookie.has('session-id')) {
            id = getRandomId();
            cookie.set('session-id', id)
        } else {
            id = cookie.get('session-id')
        }

        if(!this.pool.has(id)) {
            this.pool.set(id, new Map<string, any>());
        }

        const pool = this.pool.get(id);

        headers.append('set-cookie', cookie2String(cookie));

        console.log('id', id)

        if(pool) {
            context.session = pool;
        }

        return context;
    }
}