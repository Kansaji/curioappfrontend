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

  addToInquiredItems(id:number):Observable<any>{
    var body={'itemId': id};
    return this.httpClient.post("http://localhost:8080/api/items/addtoinquireditems",body)

  }

  getWishlist():Observable<Array<ItemPaylord>>{
    console.log('called');
    return this.httpClient.get<Array<ItemPaylord>>("http://localhost:8080/api/items/mywishlist");
    
  }
}
