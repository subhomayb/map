export interface Address {
  id: string;
  index: string;
  _score: string;
  _source: Source;
  address: string;
  location: [];
}

interface Source {
  address: string;
  location: Location[];
}

interface Location {
  coordinates: [];
  type: string;
}
