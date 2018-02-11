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
  legs: string[];
  controls: MapControls;

  private drawAndRoutePoll;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.lat = 43.6532;
    this.lng = -79.3832;
    this.zoom = 14;
    this.legs = [null, null];

    this.controls = <MapControls>{
      drawEnabled: false
    };

    this.mapService.init('map', this.lat, this.lng, this.zoom)
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

  private async enableDraw() {
    this.startPollingForRouteComplete();

    this.clearLegs();
    this.controls.drawEnabled = true;
    this.mapService.enableDraw();
    }

  private disableDraw() {
    this.stopPollingForRouteComplete();

    this.controls.drawEnabled = false;
    this.mapService.disableDraw();

  }

  private startPollingForRouteComplete() {
    this.drawAndRoutePoll = setInterval(this.pollForRouteComplete.bind(this), 100)
  }

  private stopPollingForRouteComplete() {
    clearInterval(this.drawAndRoutePoll);
  }

  private pollForRouteComplete() {
    if (this.mapService.isRoutingFinished()) {
      this.setLegs();
      this.disableDraw();
    }
  }

  private setLegs() {
    this.legs = this.mapService.mapUrls;
  }

  private clearLegs() {
    this.legs = [null, null];
  }
}
