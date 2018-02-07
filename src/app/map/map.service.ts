import { Injectable } from '@angular/core';
import { google } from "@agm/core/services/google-maps-types";

@Injectable()
export class MapService {

  enableDraw(map) {

    let poly = new google.maps.Polyline({ map: map, clickable: false });

  }

  disableDraw(map) {

  }

}
