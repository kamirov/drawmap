import { Injectable } from '@angular/core';
import {GoogleMap, MapOptions, Polyline} from "@agm/core/services/google-maps-types";
import {GoogleMapsAPIWrapper, LatLng} from "@agm/core";
import {mapStates} from "../app.constants";
import {MapListeners} from "./map-listeners";

@Injectable()
export class MapService {

  protected map: GoogleMap;
  protected mapState: mapStates;
  protected listeners: MapListeners = {
    mouseup: null,
    mousemove: null
  };
  protected line: Polyline;

  constructor(private googleMapsAPIWrapper: GoogleMapsAPIWrapper) {}

  async init(elementId, lat, lng, zoom) {
    let mapOptions: MapOptions = {
      center: <LatLng>{lat, lng},
      zoom: zoom
    };
    this.googleMapsAPIWrapper.createMap(document.getElementById(elementId), mapOptions);
    this.map = await this.googleMapsAPIWrapper.getNativeMap();
    this.mapState = mapStates.empty;
  }

  enableDraw() {
    this.mapState = mapStates.drawable;

    this.listeners.mouseup = this.map.addListener('mouseup', this.startDraw);
  }

  async startDraw() {
    this.mapState = mapStates.drawing;

    console.log('this.googleMapsAPIWrapper', this.googleMapsAPIWrapper);
    this.line = await this.googleMapsAPIWrapper.createPolyline({
      map: this.map,
      clickable: false
    });

    this.listeners.mouseup.remove();
    this.listeners.mousemove = this.map.addListener('mousemove', this.draw);
  }

  draw(e) {
    this.line.getPath().push(e.latLng);
  }

  createRoute() {
    this.mapState = mapStates.routing;

    // ...

    this.mapState = mapStates.routed;
  }

  disableDraw() {
    this.mapState = mapStates.empty;
    if (this.listeners.mousemove) {
      this.listeners.mousemove.remove();
    }

    console.log(this.listeners);
  }
}
