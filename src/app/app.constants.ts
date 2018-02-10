export const maxWaypointsCount: number = 23;

export enum mapControlEvents {
  toggleDraw = 'toggleDraw',
  updateLocation = 'updateLocation',
  updateRouteType = 'updateRouteType'
}

export enum routeTypes {
  walking = 'walking',
}

export enum mapStates {
  empty = 'empty',
  drawable = 'drawable',
  drawing = 'drawing',
  routing = 'routing',
  routed = 'routed'
}
