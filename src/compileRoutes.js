import pathToRegexp from 'path-to-regexp';

export const NO_REVERSE = Symbol();
export const NOT_FOUND = 'NOT_FOUND';

export class Routes {

  constructor(routes, notFoundAction = NOT_FOUND) {
    this.routes = routes;
    this.actions = [];
    for (const route of this.routes) {
      if (this.actions.indexOf(route.action) === -1) {
        this.actions.push(route.action);
      }
    }
    this.notFoundAction = notFoundAction;
  }

  match(url) {
    for (const route of this.routes) {
      const matchResult = route.exec(url);
      if (matchResult) {
        return matchResult;
      }
    }
    return {
      type: this.notFoundAction,
    };
  }

  reverse({ type, params = {} }) {
    for (const route of this.routes) {
      if (route.action === type) {
        return route.reverse(params);
      }
    }
    return NO_REVERSE;
  }

}

class Route {

  constructor(pattern, action) {
    this.pattern = pattern;
    this.keys = [];
    this.regex = pathToRegexp(this.pattern, this.keys);
    this.action = action;
  }

  exec(url) {
    const res = this.regex.exec(url);
    if (!res) {
      return null;
    }
    const params = {};
    this.keys.forEach((key, index) => {
      params[key.name] = res[index + 1];
    });
    return {
      type: this.action,
      params,
    };
  }

  reverse() {
    return this.pattern;
  }

}

export function compileRoutes(patterns, notFoundAction = NOT_FOUND) {
  const routes = [];

  Object.keys(patterns).forEach(pattern => {
    routes.push(new Route(pattern, patterns[pattern]));
  });

  return new Routes(routes, notFoundAction);
}
