import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {mapControlEvents} from "../../app.constants";
import {MapControls} from "./map-controls";

@Component({
  selector: 'dm-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})

export class MapControlsComponent implements OnInit {
  @Input() controls: MapControls;
  @Output() controlsChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  handleToggleClick() {
    this.controlsChange.emit({
      type: mapControlEvents.toggleDraw
    });
  }

}
