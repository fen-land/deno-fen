function extractParams (target: string, template: string) {
    let t1 = target.split('/'), t2 = template.split('/');
    const result = {};

    t2.map((el, i) => {
        if(el.startsWith(':')) {
            result[el.substring(1)] = t1[i]
        }
    })

    return result;
}

function isSamePath (target: string, template: string) {
    let t1 = target.split('/'), t2 = template.split('/');
    let result = true;

    t2.map((el, i) => {
        if(!el.startsWith(':') && el !== t1[i]) {
            result = false;
        }
    })

    return result;
}

class BasicRouter {
    
}

class Router extends BasicRouter {

    get(route, controller) {

    }

    post(route, controller) {

    }

    head(route, controller) {

    }

    put(route, controller) {

    }

    delete (route, controller) {

    }

    connect(route, controller) {

    }

    options(route, controller) {

    }

    trace(route, controller) {

    }
    
}