function extractParams(target: string, template: string) {
  let t1 = target.split("/"),
    t2 = template.split("/");
  const result = {};

  t2.map((el, i) => {
    if (el.startsWith(":")) {
      result[el.substring(1)] = decodeURIComponent(t1[i]);
    }
  });

  return result;
}

interface IRoute {
  [path: string]: {
    [method: string]: (context) => void;
  };
}

export class Router {
  constructor(name = "") {
    this.name = name;
  }

  pool = new Map<string, any>();

  name = "";

  appendRoute(method, route, controller) {
    let pool = this.pool;
    let _route = route.startsWith("/") ? route : "/" + route;
    let routeArr = _route.split("/");
    let routerName = this.name;

    for (let r of routeArr) {
      if (r) {
        if (r.startsWith(":")) {
          r = ":";
        }

        if (!pool.has(r)) {
          pool.set(r, new Map());
        }

        pool = pool.get(r);
      }
    }

    pool.set("__" + method + "__", {
      route: _route,
      method,
      controller,
      name: routerName
    });
  }

  private getRoute(path, method) {
    let pool = this.pool;
    let pathArr = path.split("/");

    for (const p of pathArr) {
      if (p) {
        if (pool.has(p)) {
          pool = pool.get(p);
        } else if (pool.has(":")) {
          pool = pool.get(":");
        } else {
          return null;
        }
      }
    }

    if (pool.has("__" + method + "__")) {
      return pool.get("__" + method + "__");
    }

    return null;
  }

  controller = async ctx => {
    let r = this.getRoute(ctx.path, ctx.method);

    if (r) {
      const { route, controller, name } = r;
      const params = extractParams(ctx.path, route);

      ctx.router = {
        route,
        params,
        name
      };

      await controller(ctx);
    } else {
      ctx.throw(404, 'Not Found Route');
    }
  };

  use(route: IRoute) {
    for (const r in route) {
      for (const method in route[r]) {
        if (route[r].hasOwnProperty(method)) {
          this.appendRoute(method.toUpperCase(), r, route[r][method]);
        }
      }
    }

    return this;
  }

  merge(route: string, router: Router) {
    let pool = this.pool;
    let _route = route.startsWith("/") ? route.slice(1) : route;
    const routeArr = _route.split("/");

    for (let r of routeArr) {
      if (r) {
        if (r.startsWith(":")) {
          r = ":";
        }

        if (!pool.has(r)) {
          pool.set(r, new Map());
        }

        pool = pool.get(r);
      }
    }

    const changeQ: Map<string, any>[] = [];

    for (const [key, val] of router.pool.entries()) {
      pool.set(key, val);
      if (val instanceof Map) {
        changeQ.push(val);
      }
    }

    while (changeQ.length > 0) {
      let change = changeQ.pop();

      for (const [key, val] of change.entries()) {
        if (val instanceof Map) {
          changeQ.push(val);
        } else if (val) {
          if (!val.orginRoute) {
            val.orginRoute = val.route;
          }
          val.route = route + val.route;
        }
      }
    }

    return this;
  }

  get(route, controller) {
    this.appendRoute("GET", route, controller);
    return this;
  }

  post(route, controller) {
    this.appendRoute("POST", route, controller);
    return this;
  }

  head(route, controller) {
    this.appendRoute("HEAD", route, controller);
    return this;
  }

  put(route, controller) {
    this.appendRoute("PUT", route, controller);
    return this;
  }

  delete(route, controller) {
    this.appendRoute("DELETE", route, controller);
    return this;
  }

  connect(route, controller) {
    this.appendRoute("CONNECT", route, controller);
    return this;
  }

  options(route, controller) {
    this.appendRoute("OPTION", route, controller);
    return this;
  }

  trace(route, controller) {
    this.appendRoute("TRACE", route, controller);
    return this;
  }
}
