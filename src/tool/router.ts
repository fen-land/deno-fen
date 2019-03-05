import {Logger} from "./logger.ts";
import {errorBodyGen} from "./body.ts";

const logger = new Logger();

function extractParams (target: string, template: string) {
    let t1 = target.split('/'), t2 = template.split('/');
    const result = {};

    t2.map((el, i) => {
        if(el.startsWith(':')) {
            result[el.substring(1)] = decodeURIComponent(t1[i]);
        }
    });

    return result;
}

interface IRoute {
    [path: string]: {
        [method: string]: (context) => void,
    }
}

export class Router {
    constructor(name = '') {
        this.name = name;
    }

    pool = new Map<string, any>();

    name = "";

    appendRoute(method, route, controller) {
        let pool = this.pool;
        let _route = route.startsWith('/') ? route : '/' + route;
        let routeArr = _route.split('/');
        let routerName = this.name;

        for (let r of routeArr) {
            if(r) {
                if (r.startsWith(':')) {
                    r = ':';
                }

                if (!pool.has(r)) {
                    pool.set(r, new Map())
                }

                pool = pool.get(r)
            }
        }

        if(pool.has('__' + method + '__')) {
            logger.warn('[Route] You are replacing route', route)
        }

        pool.set('__' + method + '__', {route: _route, method, controller, name: routerName});
    }

    private getRoute(path, method) {
        let pool = this.pool;
        let pathArr = path.split('/');

        for (const p of pathArr) {
            console.log(p);
            if (p) {
                if (pool.has(p)) {
                    pool = pool.get(p);
                } else if(pool.has(':')) {
                    pool = pool.get(':')
                } else {
                    return null;
                }
            }
        }

        if (pool.has('__' + method + '__')) {
            return pool.get('__' + method + '__')
        }

        return null
    }

    controller = async (ctx) => {
        let r = this.getRoute(ctx.path, ctx.method);

        if (r) {
            const {route, controller, name} = r;
            const params = extractParams(ctx.path, route);

            ctx.router = {
                route,
                params,
                name
            };

            await controller(ctx);
        } else {
            ctx.body = errorBodyGen("404", "Not found the file");
            ctx.status = 404;
            ctx.config.mimeType = "text/html";
        }
    };

    use(route: IRoute) {
        for(const r in route) {
            for(const method in route[r]) {
                if (route[r].hasOwnProperty(method)) {
                    this.appendRoute(method.toUpperCase(), r, route[r][method]);
                }
            }
        }

        return this;
    }

    merge(route, router:Router) {
        let pool = this.pool;
        let _route = route.startsWith('/') ? route.slice(1) : route;
        const routeArr = _route.split('/');

        for (let r of routeArr) {
            if(r) {
                if (r.startsWith(':')) {
                    r = ':';
                }

                if (!pool.has(r)) {
                    pool.set(r, new Map())
                }

                pool = pool.get(r)
            }
        }

        for (const [key, val] of router.pool.entries()) {
            pool.set(key, val);
        }

        return this;
    }

    get(route, controller) {
        this.appendRoute('GET', route, controller);
        return this;
    }

    post(route, controller) {
        this.appendRoute('POST', route, controller);
        return this;
    }

    head(route, controller) {
        this.appendRoute('HEAD', route, controller);
        return this;
    }

    put(route, controller) {
        this.appendRoute('PUT', route, controller);
        return this;
    }

    delete (route, controller) {
        this.appendRoute('DELETE', route, controller);
        return this;
    }

    connect(route, controller) {
        this.appendRoute('CONNECT', route, controller);
        return this;
    }

    options(route, controller) {
        this.appendRoute('OPTION', route, controller);
        return this;
    }

    trace(route, controller) {
        this.appendRoute('TRACE', route, controller);
        return this;
    }
    
}