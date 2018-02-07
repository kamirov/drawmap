import { Component, OnInit } from '@angular/core';
import { waypointsCount} from "../app.constants";

@Component({
  selector: 'dm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  waypointsCount: number = waypointsCount;

  constructor() { }

  ngOnInit() {
  }

}
