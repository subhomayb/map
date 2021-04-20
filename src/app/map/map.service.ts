import {Injectable} from '@angular/core';

import * as L from 'leaflet';
import {LeafletEvent, tileLayer} from 'leaflet';
import {GeocodingService} from './geocoding.service';
import {Subject} from 'rxjs';

// Marker configurations
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Injectable({
  providedIn: 'root'
})

export class MapService {
  contextMenuHandler = new Subject<any>();
  map: L.Map;
  baseMaps: any;
  vtLayer: any;
  marker: any;

  constructor(geocodingService: GeocodingService) {
  }

  setMapView(view): void {
    this.map = new L.Map(view).setView(
      [21.77, 79.75],
      5
    );
  }

  setLayers(): void {
    // TODO: // add custom layers/themes (light, dark, satellite)
    const layers = {
      baseLayers: {
        'Kesari Bharat Map': tileLayer(
          'https://dhm55dtlnkzvm.cloudfront.net/vector-tiles/{z}/{x}/{y}.pbf',
          {
            maxZoom: 15
          }
        ),
        'Open Street Map': tileLayer(
          'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          {
            subdomains: ['a', 'b', 'c'],
            maxZoom: 15,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        ),
        'Open Cycle Map': tileLayer(
          'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
          {
            subdomains: ['a', 'b', 'c'],
            maxZoom: 20,
            attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
      }
    };
    L.control.layers(layers.baseLayers, null).addTo(this.map);
  }

  setVectorTile(): void {
    L.mapboxGL({
      style: 'http://kb.letsassist.biz/v2/tiles.json'
      // style: 'http://104.198.247.176:3000/v2/tiles.json'
    }).addTo(this.map);
  }

  drawGeoJsonOnMap(data, options): object {
    return L.geoJSON(data, options).addTo(this.map);
  }

  addMarker(latitude, longitude): object {
    const icon = L.icon({
      iconUrl, shadowUrl
    });
    this.marker = new L.LatLng(latitude, longitude);
    return L.marker(this.marker, {
      draggable: true,
      icon
    }).addTo(this.map);
  }

  addPopUp(location, content): void {
    L.popup()
      .setLatLng([location.latitude, location.longitude])
      .setContent(content)
      .openOn(this.map).addTo(this.map);
  }

  fitBounds(bounds: L.LatLngBounds): void {
    this.map.fitBounds(bounds, {});
  }

  addLayer(layer): void {
    this.map.addLayer(layer);
  }

  removeLayer(layer): void {
    this.map.removeLayer(layer);
  }

  addGPSLocator(): void {
    // @ts-ignore
    L.control.locate({
        position: 'topright',
        cacheLocation: true,
        drawMarker: true,
        showPopup: true,
        drawCircle: true,
        setView: true,
        locateOptions: {
          maxZoom: 25,
        },
        strings: {
          title: 'Show me where I am, yo!',
        },
      }).addTo(this.map);
  }

  addFullscreenIcon(): void {
    // @ts-ignore
    L.control.fullscreen({
      position: 'topright',
      title: 'Show me the fullscreen !',
      titleCancel: 'Exit fullscreen mode',
      forceSeparateButton: true
    }).addTo(this.map);
  }

  addContextMenu(): void {
    // Note: // This should be used for reverse geocoding
    this.map.on('contextmenu', (event: any) => {
      const lat = parseFloat(event.latlng.lat);
      const lon = parseFloat(event.latlng.lng);
      this.contextMenuHandler.next({lat, lon});
    });
  }
}
