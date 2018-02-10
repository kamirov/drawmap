import { Component, OnInit } from '@angular/core';
import { maxWaypointsCount} from "../app.constants";

@Component({
  selector: 'dm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  maxWaypointsCount: number = maxWaypointsCount;

  constructor() { }

  ngOnInit() {
  }

}
