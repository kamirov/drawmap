import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  lat: number = 43.6532;
  lng: number = -79.3832;
  zoom: number = 14;

  constructor() { }

  ngOnInit() {
  }

}
