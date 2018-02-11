import {Component, Input, OnInit} from '@angular/core';
import {MapControls} from "../map-controls/map-controls";

@Component({
  selector: 'dm-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  @Input() legs: string[];

  constructor() { }

  ngOnInit() {
  }

}
