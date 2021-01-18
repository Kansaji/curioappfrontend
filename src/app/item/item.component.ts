import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemPaylord } from '../home/item-paylord';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  constructor(private router:ActivatedRoute, private itemService:ItemService) { }

  items:Array<ItemPaylord>;
  permalink:number;
  ngOnInit(): void {
    this.router.params.subscribe(params=>{
      this.permalink=params['id'];
      
    })
    
    this.itemService.getItemInfo(this.permalink).subscribe(data=>{
      this.items=data;
    },error=>{
      console.log('failed to get items')
    })
  }

  addToinquiredItems(element,itemId){
    
    this.itemService.addToInquiredItems(itemId).subscribe(data=>{
      element.textContent="Added";
      element.style.background='lightgreen';
      console.log('success')
    },error=>{
      element.textContent="error";
      element.style.background='lightred';
      console.log('failed');

    });
  }

  
}
