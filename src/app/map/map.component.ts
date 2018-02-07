import { Component, OnInit } from '@angular/core';
import {MapService} from "./map.service";
import {mapControlEvents, routeTypes} from "../app.constants";
import {MapControls} from "./map-controls/map-controls";

@Component({
  selector: 'dm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  lat: number;
  lng: number;
  zoom: number;
  controls: MapControls;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.lat = 43.6532;
    this.lng = -79.3832;
    this.zoom = 14;

    this.controls = <MapControls>{
      drawEnabled: false,
      routeType: routeTypes.walking
    }

    this.mapService.init('map', this.lat, this.lng, this.zoom)
    //
    // this.points = [{
    //   lat: this.lat,
    //   lng: this.lng
    // }, {
    //   lat: this.lat+1,
    //   lng: this.lng+1
    // }, {
    //   lat: this.lat-1,
    //   lng: this.lng-1
    // }]

  }

  handleControlsChange(event) {
    switch(event.type) {
      case mapControlEvents.toggleDraw:
        this.toggleDraw();
        break;
    }
  }

  toggleDraw() {
    if (this.controls.drawEnabled) {
      this.disableDraw();
    } else {
      this.enableDraw();
    }
  }

  private enableDraw() {
    this.controls.drawEnabled = true;
    this.mapService.enableDraw();
  }

  private disableDraw() {
    this.controls.drawEnabled = false;
    this.mapService.disableDraw();
  }
}
