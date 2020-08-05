const createMatchRoute = (routes, olderPathList, olderPathMap) => {
  const pathList = olderPathList || [];
  const pathMap = olderPathMap || Object.create(null);

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, route)
  });
  return {
    pathList,
    pathMap
  }
}

function addRouteRecord(pathList, pathMap, route, parent) {
  const path = parent && parent.path ? `${parent.path}/${route.path}` : route.path;
  const name = route.name;
  const record = {
    name,
    path,
    component: route.component,
    parent
  }
  if (!pathList[path]) {
    pathList.push(path);
  }
  if (!pathMap[path]) {
    pathMap[path] = record;
  }
  if (route.children) {
    route.children.forEach((childRoute) => {
      addRouteRecord(pathList, pathMap, childRoute, record)
    })
  }
}

export {
  createMatchRoute
}