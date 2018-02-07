import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import {AgmCoreModule, GoogleMapsAPIWrapper, LatLng} from '@agm/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { MapControlsComponent } from './map/map-controls/map-controls.component';
import { ShareComponent } from './map/share/share.component';
import { FooterComponent } from './footer/footer.component';
import { MapService } from "./map/map.service";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    MapControlsComponent,
    ShareComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBq7O9NfMbfQxawyUOjDDXi2ie--Cdje3s'   // Should this really be public? Probably no
    })
  ],
  providers: [
    MapService, GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
