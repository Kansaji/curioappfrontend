import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvertisementPayload } from './advertisements/advertisementPayload';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(private httpClient:HttpClient) { }

  postAdvertisement(advertisementPayload:AdvertisementPayload){
    return this.httpClient.post("http://localhost:8080/api/donationrequests/",advertisementPayload);
  }

  getAllAdvertisements():Observable<Array<AdvertisementPayload>>{
    return this.httpClient.get<Array<AdvertisementPayload>>("http://localhost:8080/api/donationrequests/alldonationrequests");
  }
}
