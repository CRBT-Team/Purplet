export function type() {

}

export function route(routeData) {
  return routeData;
}

export function group(routes) {
  return rest =>
    Object.fromEntries(
      Object.entries(routes).map(([k, meta]) => [
        k,
        (obj = {}) => {
          const endpoint =
            typeof meta.route === 'function'
              ? meta.route(...(meta.params ?? []).map(param => obj[param]))
              : meta.route;
          return rest.request(endpoint, { method: meta.method, ...obj });
        },
      ])
    );
}
