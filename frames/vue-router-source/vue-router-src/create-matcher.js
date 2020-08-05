import {createMatchRoute} from './create-match-route';
import {createRoute} from './history/base';

export function createMatcher(routes) {
  const {pathList, pathMap} = createMatchRoute(routes);
  // console.log(pathList, pathMap);

  const match = (location) => {
    let record = pathMap[location];

    // 这里暂时做简单处理下
    if (!record) {
      location = '*';
      record = pathMap[location] || pathMap['/'];
    }
    // console.log(record);

    return createRoute(record, {
      path: location
    })
  }

  const addRoutes = (routes) => {
    createMatchRoute(routes, pathList, pathMap);
  }
  return {
    match,
    addRoutes
  }
}