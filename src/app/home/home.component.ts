import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { ItemPaylord } from './item-paylord';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  addItemForm: FormGroup;
  itemPaylord:ItemPaylord;
  isSuccess:boolean;
  
  constructor(private formBuilder: FormBuilder, private itemService:ItemService , private router:Router) { 

    this.addItemForm = this.formBuilder.group({
      itemName:['',Validators.required],
      type:['',Validators.required],
      description:['',Validators.required]
    });

    this.itemPaylord={
      itemName:'',
      type:'',
      description:''
    };
    this.isSuccess=false;
    
  }

  ngOnInit(): void {
  }

  postItem(){
    this.addItemForm.markAllAsTouched();
    if(this.addItemForm.valid){
      this.itemPaylord.itemName=this.addItemForm.get('itemName').value;
      this.itemPaylord.type=this.addItemForm.get('type').value;
      this.itemPaylord.description=this.addItemForm.get('description').value;
      
      this.itemService.addItem(this.itemPaylord).subscribe(data=>{
       this.isSuccess=true;
        
      },error=>{
        console.log("post item failed");
        this.isSuccess=true;
      });
    }
    
  }

}
