import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from '../item.service';
import { ItemPaylord } from './item-paylord';
import {DomSanitizer} from '@angular/platform-browser'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  addItemForm: FormGroup;
  itemPaylord:ItemPaylord;
  isSuccess:boolean;
  base64textString:String;
  myItems: Observable<Array<ItemPaylord>>;
  myItemsArr:Array<ItemPaylord>
  imageSelected:boolean=false;
  myItemsSelected:boolean;
  wishlistSelected:boolean;

  constructor(private formBuilder: FormBuilder, private itemService:ItemService , private router:Router, private _sanitizer: DomSanitizer) { 

    this.addItemForm = this.formBuilder.group({
      itemName:['',Validators.required],
      type:['',Validators.required],
      description:['',Validators.required],
      photo:['',Validators.required]
    });

    this.itemPaylord={
      itemId:0,
      itemName:'',
      type:'',
      description:'',
      photo:''
    };
    this.isSuccess=false;
    this.base64textString=null;
    this.myItemsSelected=true;
    this.wishlistSelected=false;
  }

  ngOnInit(): void {
   this.myItems=this.itemService.getMyItems();
   
    
  }

  postItem(){
    this.addItemForm.markAllAsTouched();
    if(this.addItemForm.valid){
      this.itemPaylord.itemId=0;
      this.itemPaylord.itemName=this.addItemForm.get('itemName').value;
      this.itemPaylord.type=this.addItemForm.get('type').value;
      this.itemPaylord.description=this.addItemForm.get('description').value;
      this.itemPaylord.photo=this.base64textString;
      console.log(this.base64textString);
      this.itemService.addItem(this.itemPaylord).subscribe(data=>{
       this.isSuccess=true;
        
      },error=>{
        console.log("post item failed");
        this.isSuccess=true;
      });
    }
    
  }
  onFileChange(event){
   var files = event.target.files;
   var file = files[0];
   if(files && file){
     var reader = new FileReader();
     reader.onload=this._handleReaderLoaded.bind(this);
     reader.readAsBinaryString(file);
     this.imageSelected=true;
   }
  }
  _handleReaderLoaded(readerEvt){
    var binaryString = readerEvt.target.result;
    this.base64textString=btoa(binaryString);

  }

  showMyItems(){
    this.myItemsSelected=true;
    this.wishlistSelected=false;
  }

  showWishlist(){
    this.wishlistSelected=true;
    this.myItemsSelected=false;
  }
}
