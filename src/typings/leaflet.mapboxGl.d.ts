import * as L from 'leaflet';

declare module 'leaflet' {
  function mapboxGL(options: any): any;
}
