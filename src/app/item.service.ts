import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InquiryPayload } from './home/inquiry-payload';
import { ItemPaylord } from './home/item-paylord';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url="http://localhost:8080/api"
  constructor(private httpClient:HttpClient) {

  }

  addItem(itemPaylord:ItemPaylord):Observable<any>{
    return this.httpClient.post("http://localhost:8080/api/items/", itemPaylord);
  }

  getMyItems():Observable<Array<ItemPaylord>>{
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/myitems");
  }

  getAllItems(distanceValue:number):Observable<Array<ItemPaylord>>{
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/all/"+distanceValue);
  }

  addToInquiredItems(itemId:number):Observable<any>{
    var body={'itemId': itemId};
    return this.httpClient.post("http://localhost:8080/api/items/addtoinquireditems",body)

  }

  getWishlist():Observable<Array<ItemPaylord>>{
    console.log('called');
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/mywishlist");
    
  }

  sendInquiry(inquiryPayload:InquiryPayload):Observable<any>{
    return this.httpClient.post("http://localhost:8080/api/items/makeinquiry",inquiryPayload);  
  }

  getInquiries(itemId:number):Observable<any>{
    var body={'itemId': itemId};
    return this.httpClient.get("http://localhost:8080/api/items/getinquiries/"+itemId);

  }

  sendReply(inquiryPayload:InquiryPayload){
      return this.httpClient.post("http://localhost:8080/api/items/reply",inquiryPayload);
  }

  removeFromWishlist(itemId:number):Observable<any>{
    return this.httpClient.post("http://localhost:8080/api/items/removefromwishlist/"+itemId,{});
  }

  removeFromMyItems(itemId:number):Observable<any>{
    console.log(itemId);
    return this.httpClient.post("http://localhost:8080/api/items/removefrommyitems/"+itemId,{});
  }

  GeolocationPosition(): Promise<any>{
    return new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition(resp=>{
        resolve({longitude:resp.coords.longitude, latitude:resp.coords.latitude});
      },err=>{
        reject(err);
      });
    });
  }

  updateCurrentGeolocation(longitude:number, latitude:number):Observable<any>{
    var body={
      'longitude':longitude,
      'latitude':latitude
    }
    console.log(longitude +","+latitude);
    
    console.log('api called');
    
    return this.httpClient.put("http://localhost:8080/api/items/updatecurrentgeolocation",body);
  }

  getMyStats():Observable<any>{
    return this.httpClient.get("http://localhost:8080/api/items/getmystats");
  }

  getItemsByUsername(distanceValue:number,search:String):Observable<Array<ItemPaylord>>{
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/getitemsbyusername/"+distanceValue+"/"+search);
  }

  getItemsByType(distanceValue:number,search:String):Observable<Array<ItemPaylord>>{
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/getitemsbyitemtype/"+distanceValue+"/"+search);
  }

  getItemsByItemName(distanceValue:number,search:String):Observable<Array<ItemPaylord>>{
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/getitemsbyitemname/"+distanceValue+"/"+search);
  }
}

