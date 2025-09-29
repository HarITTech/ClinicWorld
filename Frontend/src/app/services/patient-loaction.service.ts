import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientLoactionService {

  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by this browser.');
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              reject('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              reject('The request to get user location timed out.');
              break;
            default:
              reject('An unknown error occurred.');
              break;
          }
        }
      );
    });
  }
}
