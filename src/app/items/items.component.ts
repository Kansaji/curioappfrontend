import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemService } from '../item.service';
import { ItemPaylord } from '../home/item-paylord';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  allItems: Observable<Array<ItemPaylord>>;
  distanceForm: FormGroup;
  distance:String='All users';
  goClicked:boolean=false;
  
  constructor(private itemService: ItemService, private formBuilder:FormBuilder) { 
    this.distanceForm = this.formBuilder.group({
      distance:['100'] 
    });

    this.distanceForm.controls.distance.valueChanges.subscribe(
    
      x => {
        this.goClicked=false;
        if (x<100){
        this.distance="users with in "+ this.distanceForm.get('distance').value+" km distance from your location"
      }else if(x>=100){
        this.distance='All users'
      }

      }
    )
  }

  ngOnInit(): void {
    var distanceValue=this.distanceForm.get('distance').value;
    this.allItems=this.itemService.getAllItems(distanceValue);
   
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

  onSubmit(){
    var distanceValue=this.distanceForm.get('distance').value
    console.log(distanceValue);
    this.allItems=this.itemService.getAllItems(distanceValue);
    this.goClicked=true;
    
  }
  
 
}
