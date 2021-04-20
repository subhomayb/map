import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import * as L from "leaflet";

@Injectable({
  providedIn: 'root'
})

export class MapService {

  map: L.Map;
  baseMaps: any;
  vtLayer: any;

  constructor(http: HttpClient) {
  }

  addMarker(e: L.LeafletMouseEvent) {
    const shortLat = Math.round(e.latlng.lat * 1000000) / 1000000;
    const shortLng = Math.round(e.latlng.lng * 1000000) / 1000000;
    const popup = `<div>Latitude: ${shortLat}<div><div>Longitude: ${shortLng}<div>`;
    const icon = L.icon({
      iconUrl: "assets/marker-icon.png",
      shadowUrl: "assets/marker-shadow.png"
    });

    const marker = L.marker(e.latlng, {
      draggable: true,
      icon
    })
      .bindPopup(popup, {
        offset: L.point(12, 6)
      })
      .addTo(this.map)
      .openPopup();

    marker.on("click", () => marker.remove());
  }

  fitBounds(bounds: L.LatLngBounds) {
    this.map.fitBounds(bounds, {});
  }
}
