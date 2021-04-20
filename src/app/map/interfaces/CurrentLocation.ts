export interface CurrentLocation {
  coords: Coords;
  timestamp: number;
}

interface Coords {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: null;
  latitude: number;
  longitude: number;
  speed: null;
}
