import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemService } from '../item.service';
import { ItemPaylord } from '../home/item-paylord';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  myItems: Observable<Array<ItemPaylord>>;
  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.myItems=this.itemService.getAllItems();
  }

}
