import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getAllItems():Observable<Array<ItemPaylord>>{
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/all");
  }

  addToInquiredItems(itemId:number):Observable<any>{
    var body={'itemId': itemId};
    return this.httpClient.post("http://localhost:8080/api/items/addtoinquireditems",body)

  }

  getWishlist():Observable<Array<ItemPaylord>>{
    console.log('called');
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/mywishlist");
    
  }

  sendInquiry(itemId:number,message:String):Observable<any>{
    var body={
      'from':'',
      'to':'',
      'itemId':itemId,
      'message':message};
    return this.httpClient.post("http://localhost:8080/api/items/makeinquiry",body);  
  }

  getInquiries(itemId:number):Observable<any>{
    var body={'itemId': itemId};
    return this.httpClient.get("http://localhost:8080/api/items/getinquiries/"+itemId);

  }

  sendReply(itemId:number,sendTo:String,reply:String){
    var body={
      'from':'',
      'to':sendTo,
      'itemId':itemId,
      'message':reply};
      return this.httpClient.post("http://localhost:8080/api/items/reply",body);
  }

  removeFromWishlist(itemId:number):Observable<any>{
    return this.httpClient.post("http://localhost:8080/api/items/removefromwishlist/"+itemId,{});
  }
}
