// Google's limitation is 23, but their map client's limitation is 10, so we use 20 and split the journey into 2 legs
export const maxWaypointsCount: number = 20;
export const maxWaypointsPerLeg: number = 10;

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
