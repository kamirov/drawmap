import { Injectable } from '@angular/core';
import {GoogleMap, MapOptions, Polyline} from "@agm/core/services/google-maps-types";
import {GoogleMapsAPIWrapper, LatLng} from "@agm/core";
import {mapStates, maxWaypointsCount} from "../app.constants";
import {MapListeners} from "./map-listeners";
import {MapMarkers} from "./map-markers";
const linspace = require("linspace");
declare var google: any;
declare var require: any;

@Injectable()
export class MapService {

  protected map: GoogleMap;
  protected mapState: mapStates;
  protected listeners: MapListeners = {
    mousedown: null,
    mousemove: null
  };
  protected line: Polyline;
  protected markers: MapMarkers = {
    start: null,
    end: null
  };

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
    this.listeners.mousedown = this.map.addListener('mousedown', this.startDraw.bind(this));
  }

  async startDraw() {
    this.mapState = mapStates.drawing;
    this.line = await this.googleMapsAPIWrapper.createPolyline({
      map: this.map,
      clickable: false
    });

    this.listeners.mousedown.remove();
    this.listeners.mousemove = this.map.addListener('mousemove', this.draw.bind(this));
    this.listeners.mousedown = this.map.addListener('mousedown', this.startRouteCreate.bind(this));
  }

  draw(e) {
    this.line.getPath().push(e.latLng);
  }

  startRouteCreate() {
    this.mapState = mapStates.routing;
    this.listeners.mousemove.remove();
    this.listeners.mousedown.remove();

    this.createRoute();
  }

  async createRoute() {
    let waypoints: any = await this.getWaypoints();

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    })
    directionsDisplay.setMap(this.map);

    console.log(waypoints);
    console.log(waypoints[0])

    // Add start and end markers
    this.markers.start = new google.maps.Marker({
      position: waypoints[0].location,
      map: this.map,
      title: "Start"
    });
    this.markers.end = new google.maps.Marker({
      position: waypoints[waypoints.length-1].location,
      map: this.map,
      title: "End"
    });

    // Add route
    directionsService.route({
      origin: waypoints[0].location,
      destination: waypoints[waypoints.length-1].location,
      waypoints: waypoints,
      travelMode: 'WALKING',
      optimizeWaypoints: false
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });


    this.line = null;

    this.mapState = mapStates.routed;
  }

  private async getWaypoints() {
    let points: any = await this.line.getPath();

    let waypointsCount = Math.min(points.length, maxWaypointsCount)
    let indices = linspace(0, points.length - 1, waypointsCount);    // Generate equal steps
    indices = indices.map(idx => Math.floor(idx))                    // Only allow integers
    points = indices.map(idx => points.getAt(idx));

    return points.map(point => ({
      location: point,
      stopover: true
    }));
  }

  disableDraw() {
    this.mapState = mapStates.empty;
    if (this.listeners.mousemove) {
      this.listeners.mousemove.remove();
    }

    console.log(this.listeners);
  }
}
