import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

// import leaflet modules/libraries here
import * as L from 'leaflet';
import '../../../node_modules/mapbox-gl-leaflet/leaflet-mapbox-gl.js';
import '../../../node_modules/leaflet.locatecontrol/src/L.Control.Locate.js';
import '../../../node_modules/leaflet.fullscreen/Control.FullScreen.js';

// services
import {MapService} from './map.service';
import {GeocodingService} from './geocoding.service';

// import all interfaces here
import {CurrentLocation} from './interfaces/CurrentLocation';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;

  private currentLocation: CurrentLocation;
  private isFetchingLandmarkPoints: boolean;
  marker: any;

  constructor(
    private mapService: MapService,
    private geocodingService: GeocodingService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.geocodingService.getCurrentLocation().then((data: CurrentLocation) => {
        this.currentLocation = data;
        this.marker = this.mapService.addMarker(data.coords.latitude, data.coords.longitude);
        this.marker
          .bindPopup(`<div><p> Here you are!! </p> </div>`);
      });
    }, 10000);
  }

  ngAfterViewInit(): void {
    // initialize map (with any user's center location)
    this.mapService.setMapView(this.mapContainer.nativeElement);

    // change the position of zoom controls (topleft' | 'topright' | 'bottomleft' | 'bottomright)
    this.mapService.map.zoomControl.setPosition('topright');

    this.mapService.setLayers();
    // render custom vector tiles with own style
    this.mapService.setVectorTile();

    // add GPS locastor on mao
    this.mapService.addGPSLocator();

    // add fullscreen button on map
    this.mapService.addFullscreenIcon();

    this.mapService.addContextMenu();
  }
}
