import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from '../item.service';
import { ItemPaylord } from './item-paylord';
import {DomSanitizer} from '@angular/platform-browser'
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { rejects } from 'assert';

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
  wishlist:Observable<Array<ItemPaylord>>;
  imageSelected:boolean=false;
  myItemsSelected:boolean;
  wishlistSelected:boolean;
  sendInquiryForm: FormGroup;
  successfullySentMsg:String;
  inquiries:Observable<Array<any>>;
  user:String;
  replyInWishlist:String;
  sendTo:String;
  sendReplyForm:FormGroup;
  replyMyitems:String;
  successfullySentReply:String;

  constructor(private formBuilder: FormBuilder, private itemService:ItemService , private router:Router, private localStorageService:LocalStorageService) { 

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
      photo:'',
      postedUser:''
    };

    this.sendInquiryForm=this.formBuilder.group({
      message:['']
    });
    this.sendReplyForm=this.formBuilder.group({
      reply:['']
    })
    
    this.isSuccess=false;
    this.base64textString=null;
    this.myItemsSelected=true;
    this.wishlistSelected=false;
    this.user=this.localStorageService.retrieve('username');
    this.sendInquiryForm.clearAsyncValidators();
    this.replyInWishlist='';
    this.sendTo='';
    this.replyMyitems='';
    
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
    this.wishlist=this.itemService.getWishlist();
  
  }

  sendInquiry(itemId){
   var message=this.sendInquiryForm.get('message').value
   if(message!=""){
     if(this.replyInWishlist!=''){
      message="[ "+this.replyInWishlist+"]  "+message;
     }
     
    this.itemService.sendInquiry(itemId,message).subscribe(data=>{
      console.log('success'+itemId);
      this.inquiries=this.itemService.getInquiries(itemId);
    },error=>{
      console.log('failed');

    });
   } 
  
  }

  getInquiries(itemId){
    this.inquiries=this.itemService.getInquiries(itemId);
    console.log(itemId)
    this.successfullySentMsg="";
    console.log(this.inquiries)
    this.replyInWishlist='';
    this.replyMyitems='';
    this.sendTo='';
    this.successfullySentReply='';
    
  }

  mentionMessageInWishlist(user,message){
      this.replyInWishlist=user+': '+message+' ';
   
  }
  deletementionMessageInWishlist(){
    this.replyInWishlist=''
  }

  MentionMessageInMyItems(user,message){
      this.replyMyitems=user+': '+message+' ';
   
  }
  
  deleteMentionMessageInMyItems(){
    this.replyMyitems='';
  }

  setReplyUser(user){
      this.sendTo=user;
  }

  deleteSetReplyUser(){
    this.sendTo='';
}

  sendReply(itemId){
    var reply=this.sendReplyForm.get('reply').value
    if(reply!=''&& this.sendTo!=''){
      if(this.replyMyitems!=''){
      reply="[ "+this.replyMyitems+"]  " + reply;
      }
      this.itemService.sendReply(itemId,this.sendTo,reply).subscribe(data=>{
        console.log('successfully replied');
        this.sendTo='';
        this.replyMyitems='';
        this.inquiries=this.itemService.getInquiries(itemId);
        alert('sending');
      },error=>{
        console.log('replying failed');
      });
    }
  }

  removeFromWishlist(itemId,element){
    this.itemService.removeFromWishlist(itemId).subscribe(data=>{
      element.textContent="Removed";
      element.style.background='lightgreen';
      console.log('success')
    },error=>{
      element.textContent="error";
      element.style.background='lightred';
      console.log('failed');

    });

  }
 
}
