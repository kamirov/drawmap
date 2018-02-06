import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { MapControlsComponent } from './map-controls/map-controls.component';
import { ShareComponent } from './share/share.component';
import { FooterComponent } from './footer/footer.component';


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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
