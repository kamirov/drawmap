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

  lat: number = 43.6532;
  lng: number = -79.3832;
  zoom: number = 14;
  controls: MapControls;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.controls = <MapControls>{
      drawEnabled: false,
      routeType: routeTypes.walking
    }
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

    console.log('enabling', this.controls);
    // this.mapService.enableDraw();
  }

  private disableDraw() {
    this.controls.drawEnabled = false;
  }
}
