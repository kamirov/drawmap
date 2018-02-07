import {routeTypes} from "../../app.constants";

export interface MapControls {
  drawEnabled: boolean,
  lat: number,
  lng: number,
  routeType: routeTypes
}
