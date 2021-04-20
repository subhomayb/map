import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GeocodingService {

  constructor(private http: HttpClient) {
  }

  BASE_URL = environment.BASE_URL;

  getCurrentLocation(): Promise<object> {
    // get current location of the user
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((data) => {
          return resolve(data);
        });
      });
    } else {
      alert('Geolocation is not supported in your browser');
    }
  }

  getAutoSuggestAddresses(text): Observable<object> {
    return this.http.post(`${this.BASE_URL}autosuggest`, {query: text});
  }

  getSuggestedTerms(text): Observable<object> {
    return this.http.post(`${this.BASE_URL}suggest-terms`, {query: text});
  }

  getNearByPlaces(query): Observable<object> {
    return this.http.post(`${this.BASE_URL}near-place`, {query});
  }

  getPlaceDetails(query): Observable<object> {
    return this.http.post(`${this.BASE_URL}search-place`, query);
  }

}
