import {Component, OnInit} from '@angular/core';
import {GeocodingService} from '../geocoding.service';
import {MapService} from '../map.service';
import {Address} from '../interfaces/Address';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.css']
})
export class AddressSearchComponent implements OnInit {

  items: Address[];
  place: any;
  hideResult: boolean;
  polygon: any;
  marker: any;
  searchInput: any;

  constructor(private geocodingService: GeocodingService,
              private mapService: MapService) {
    this.mapService.contextMenuHandler.subscribe((event: any) => {
      this.getPlaceDetails(event.lat, event.lon);
    });
  }


  ngOnInit(): void {
    this.searchInput = document.getElementsByClassName('leaflet-searchbox-control-input')[0];
    this.searchInput.onkeyup = (event) => {
      this.hideResult = false;
      if (this.searchInput.value.length > 2) {
        this.searchLocation(this.searchInput.value);
      }
    };
  }

  searchLocation(input): any {
    this.geocodingService.getAutoSuggestAddresses(input)
      .toPromise().then((response: { status: number, message: string, data: Address[] }) => {
      this.items = response.data;
    });
  }

  zoomToSearchAddress(item): void {
    this.searchInput.value = item._source.address;
    if (item._source.business) {
      const lat = item._source.location.lat;
      const lng = item._source.location.lon;
      // tslint:disable-next-line:no-unused-expression
      this.marker && this.mapService.removeLayer(this.marker);
      this.marker = this.mapService.addMarker(lat, lng);
      this.mapService.map.setView([lat, lng], 12);
      this.marker
        .bindPopup(`<div><p> ${item._source.address}</p> </div>`);
    } else {
      // tslint:disable-next-line:no-unused-expression
      this.polygon && this.polygon.clearLayers();
      this.polygon = this.mapService.drawGeoJsonOnMap(item._source.location_list, {color: 'red'});
      this.mapService.fitBounds(this.polygon.getBounds());
    
      this.hideResult = true;  this.polygon.bindPopup(`<div><p> ${item._source.address}</p> </div>`);
    }
  }

  getPlaceDetails(lat, lon): void {
    this.geocodingService.getPlaceDetails({query: {lat, lon}})
      .toPromise().then((response: { status: number, message: string, data: Address }) => {
      // we will get polygon data for now
      this.place = response.data;
      if (this.place) {
        // tslint:disable-next-line:no-unused-expression
        this.polygon && this.polygon.clearLayers();
        this.polygon = this.mapService.drawGeoJsonOnMap(this.place._source.location_list, {color: 'red', weight: 1, fillOpacity: 0.01});
        this.mapService.fitBounds(this.polygon.getBounds());
        const content  = `${this.place._source.address}`;
        this.polygon.bindPopup(content);
      }
    });
  }

  getNearByLocation(place): void {
    const query = {
      lat: place.location.lat,
      lon: place.location.lon,
      category: place.category
    };
    this.geocodingService.getNearByPlaces(query)
      .toPromise().then((response: []) => {
      this.searchInput.value = `search near by ${place.category} from ${place.address}`;
      this.items = response;
    });
  }
}
