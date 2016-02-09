import UriTemplate from 'uri-templates';

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
    return null;
  }

}

class Route {

  constructor(pattern, action) {
    this.template = new UriTemplate(pattern);
    this.action = action;
  }

  exec(url) {
    const params = this.template.fromUri(url);
    if (!params) {
      return null;
    }
    return {
      type: this.action,
      params,
    };
  }

  reverse(params = {}) {
    return this.template.fill(params);
  }

}

export function compileRoutes(patterns, notFoundAction = NOT_FOUND) {
  const routes = [];

  Object.keys(patterns).forEach(pattern => {
    routes.push(new Route(pattern, patterns[pattern]));
  });

  return new Routes(routes, notFoundAction);
}
