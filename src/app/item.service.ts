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
}
