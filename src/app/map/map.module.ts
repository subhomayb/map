import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {CommonModule} from '@angular/common';
import {MapComponent} from './map.component';

import {MapService} from './map.service';
import {GeocodingService} from './geocoding.service';
import { AddressSearchComponent } from './address-search/address-search.component';

@NgModule({
  declarations: [
    MapComponent,
    AddressSearchComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    MapService,
    GeocodingService
  ],
})

export class MapModule {
}
