import { Injectable } from '@angular/core';

import {GoogleMap, MapOptions, Polyline} from "@agm/core/services/google-maps-types";
import {GoogleMapsAPIWrapper, LatLng} from "@agm/core";

import {mapStates, maxWaypointsCount, maxWaypointsPerLeg} from "../app.constants";
import {MapListeners} from "./map-listeners";
import {MapMarkers} from "./map-markers";
const linspace = require("linspace");

declare var google: any;
declare var require: any;

@Injectable()
export class MapService {

  public routeDistance: number;
  public mapUrls: string[] = [null, null];

  protected map: GoogleMap;
  protected mapState: mapStates;
  protected listeners: MapListeners = {
    mousedown: null,
    mouseup: null,
    mousemove: null,
  };
  protected line: Polyline;
  protected markers: MapMarkers = {
    start: null,
    end: null
  };
  protected directionsService: any;
  protected directionsDisplay: any;

  constructor(protected googleMapsAPIWrapper: GoogleMapsAPIWrapper) {}

  /**
   * Initializes GMap and service
   * @param elementId
   * @param lat
   * @param lng
   * @param zoom
   */
  async init(elementId, lat, lng, zoom) {
    let mapOptions: MapOptions = {
      center: <LatLng>{lat, lng},
      zoom: zoom,
      clickableIcons: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    // Init map
    this.googleMapsAPIWrapper.createMap(document.getElementById(elementId), mapOptions);
    this.map = await this.googleMapsAPIWrapper.getNativeMap();
    this.mapState = mapStates.empty;

    // Init directions
    this.directionsService = new google.maps.DirectionsService;
  }


  /**
   * Checks if routing is finished (duh)
   * @returns {boolean}
   */
  isRoutingFinished() {
    return this.mapState === mapStates.routed;
  }


  /**
   * Prepares map to start drawing
   */
  enableDraw() {
    this.mapState = mapStates.drawable;

    this.clearMap();

    this.map.setOptions({
      draggable: false,
      zoomControl: false
    });
    this.listeners.mousedown = this.map.addListener('mousedown', this.startDraw.bind(this));
  }

  clearMap() {
    if (this.markers.start) {
      this.markers.start.setMap(null);
      this.markers.start = null;
    }

    if (this.markers.end) {
      this.markers.end.setMap(null);
      this.markers.end = null;
    }

    if (this.markers.end) {
      this.markers.end.setMap(null);
      this.markers.end = null;
    }

    if (this.line) {
      this.line.setMap(null);
      this.line = null;
    }

    if (this.directionsDisplay) {
      this.directionsDisplay.setMap(null);
      this.directionsDisplay = null;
    }
  }


  /**
   * Disable drawing mode, reset map state
   */
  disableDraw() {
    this.mapState = mapStates.empty;

    if (this.listeners.mousemove) {
      this.listeners.mousemove.remove();
    }

    if (this.listeners.mousedown) {
      this.listeners.mousedown.remove();
    }

    if (this.listeners.mouseup) {
      this.listeners.mouseup.remove();
    }

    this.map.setOptions({
      draggable: true,
      zoomControl: true
    });
  }

  /**
   * Starts drawing a line on the map based on user's mouse position
   * @returns {Promise<void>}
   */
  protected async startDraw() {
    this.mapState = mapStates.drawing;

    this.line = await this.googleMapsAPIWrapper.createPolyline({
      map: this.map,
      clickable: false,
      strokeColor: "#000000",
      strokeOpacity: 0.6,
      strokeWeight: 4
    });

    this.listeners.mousedown.remove();
    this.listeners.mousemove = this.map.addListener('mousemove', this.draw.bind(this));
    this.listeners.mouseup = this.map.addListener('mouseup', this.startRouteCreate.bind(this));
  }


  /**
   * Stores current cursor's coordinates on line
   * @param e
   */
  protected draw(e) {
    if (this.line) {
      this.line.getPath().push(e.latLng);
    } else {
      console.warn('No polyline object');
    }
  }


  /**
   * Prepares map to create a route based off drawing
   */
  protected startRouteCreate() {
    this.mapState = mapStates.routing;

    this.directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      map: this.map
    });

    this.listeners.mousemove.remove();
    this.listeners.mousedown.remove();
    this.listeners.mouseup.remove();

    this.createRoute();
  }


  /**
   * Creates a route, adds start-end markers
   * @returns {Promise<void>}
   */
  protected async createRoute() {
    let waypoints: any = await this.getWaypoints();

    if (waypoints.length) {
      // Add route
      this.directionsService.route({
        origin: waypoints[0].location,
        destination: waypoints[waypoints.length-1].location,
        waypoints: waypoints,
        travelMode: 'WALKING',
        optimizeWaypoints: false
      }, (response, status) => {
        if (status === 'OK') {

          this.line.setOptions({ strokeOpacity: 0.3 });
          this.directionsDisplay.setDirections(response);

          let routeDistance = this.setDistance(response.routes[0].legs)
          this.addMarkers(waypoints[0].location, waypoints[waypoints.length-1].location, routeDistance)

        } else {
          window.alert('Directions request failed due to ' + status)
        }
      });

      this.setMapUrls(waypoints);
    }

    this.mapState = mapStates.routed;
  }

  protected setDistance(legs: any) {
    this.routeDistance = legs.reduce((distance, leg) => {
      return distance + leg.distance.value;
    }, 0);

    // Convert m to km
    this.routeDistance /= 1000;
    this.routeDistance = +this.routeDistance.toFixed(1);

    // Eh?
    return this.routeDistance;
  }


  /**
   * Generates 2 URLs for each half of the journey
   * TODO: This method should really be cleaned up
   * @param waypoints
   */
  protected setMapUrls(waypoints) {
    this.mapUrls = [null, null];

    let mapUrl =  'https://www.google.com/maps/dir/?api=1';

    // Add travel mode
    mapUrl += '&travelmode=walking';

    // Add waypoints
    mapUrl += '&waypoints=';

    // For short routes, don't divide per leg. For long routes, divide in two
    if (waypoints.length > maxWaypointsPerLeg) {
      // Leg 1
      this.mapUrls[0] = mapUrl;
      for (let i = 1; i < maxWaypointsPerLeg-1; i++) {
        this.mapUrls[0] += waypoints[i].location.lat() + ',' + waypoints[i].location.lng() + '|';
      }
      this.mapUrls[0] = this.mapUrls[0].slice(0,-1);    // Remove trailing '|'

      // Leg 2
      this.mapUrls[1] = mapUrl;
      for (let i = maxWaypointsPerLeg; i < waypoints.length; i++) {
        this.mapUrls[1] += waypoints[i].location.lat() + ',' + waypoints[i].location.lng() + '|';
      }
      this.mapUrls[1] = this.mapUrls[1].slice(0,-1);    // Remove trailing '|'

      // Add start
      this.mapUrls[0] += '&origin=' + waypoints[0].location.lat() + ',' + waypoints[0].location.lng();
      this.mapUrls[1] += '&origin=' + waypoints[maxWaypointsPerLeg-1].location.lat() + ',' + waypoints[maxWaypointsPerLeg-1].location.lng();

      // Add end
      this.mapUrls[0] += '&destination=' + waypoints[maxWaypointsPerLeg-1].location.lat() + ',' + waypoints[maxWaypointsPerLeg-1].location.lng();
      this.mapUrls[1] += '&destination=' + waypoints[waypoints.length-1].location.lat() + ',' + waypoints[waypoints.length-1].location.lng();

    } else {

      this.mapUrls[0] = mapUrl;

      // Waypoints
      for (let i = 1; i < waypoints.length-1; i++) {
        this.mapUrls[0] += waypoints[i].location.lat() + ',' + waypoints[i].location.lng() + '|';
      }
      this.mapUrls[0] = this.mapUrls[0].slice(0,-1);    // Remove trailing '|'

      // Start and end
      this.mapUrls[0] += '&origin=' + waypoints[0].location.lat() + ',' + waypoints[0].location.lng();
      this.mapUrls[0] += '&destination=' + waypoints[waypoints.length-1].location.lat() + ',' + waypoints[waypoints.length-1].location.lng();
    }
  }


  /**
   * Convert polyline to waypoints
   * @returns {Promise<void>}
   */
  protected async getWaypoints() {
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


  /**
   * Add start and end markers
   * @param start
   * @param end
   * @param distance
   */
  protected addMarkers(start, end, distance) {
    this.markers.start = new google.maps.Marker({
      position: start,
      map: this.map,
      title: "Start",
      animation: google.maps.Animation.DROP,
    });
    this.markers.end = new google.maps.Marker({
      position: end,
      map: this.map,
      title: `End`,
      animation: google.maps.Animation.DROP,
    });

    let infoWindow = new google.maps.InfoWindow({
      content: distance + 'km'
    });

    infoWindow.open(this.map, this.markers.end);
  }
}
