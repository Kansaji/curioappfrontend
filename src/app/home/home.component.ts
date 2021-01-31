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
import {InquiryPayload} from './inquiry-payload';
import {DatePipe} from '@angular/common'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[DatePipe]
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
 
  inquiries:Observable<Array<any>>;
  user:String;
  replyInWishlist:String;
  sendTo:String;
  sendReplyForm:FormGroup;
  replyMyitems:String;
 

  newlySentInquiries:Array<InquiryPayload>=[];
  newlySentReplies:Array<InquiryPayload>=[];
  inquiryPayload:InquiryPayload;

  constructor(private formBuilder: FormBuilder, private itemService:ItemService , private router:Router, private localStorageService:LocalStorageService, private datePipe:DatePipe) { 

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
    this.inquiryPayload={
      from:'',
      to:'',
      itemId:0,
      message:'',
      timeStamp:''

    }  
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

    this.inquiryPayload.message=message;
    this.inquiryPayload.itemId=itemId;
    this.inquiryPayload.from='';
    this.inquiryPayload.to=this.sendTo;
    this.inquiryPayload.timeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');

    let inquiry=Object.assign({},this.inquiryPayload);

    this.itemService.sendInquiry(this.inquiryPayload).subscribe(data=>{
      console.log('success'+itemId);
      this.newlySentInquiries.push(inquiry);
      this.replyInWishlist='';
    },error=>{
      console.log('failed');

    });
   } 
  
  }

  getInquiries(itemId){
    this.inquiries=this.itemService.getInquiries(itemId);
    console.log(itemId)
    console.log(this.inquiries)
    this.replyInWishlist='';
    this.replyMyitems='';
    this.sendTo='';
    this.newlySentInquiries=[];
    this.newlySentReplies=[];

    
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
      this.inquiryPayload.message=reply;
      this.inquiryPayload.itemId=itemId;
      this.inquiryPayload.from='';
      this.inquiryPayload.to=this.sendTo;
      this.inquiryPayload.timeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');
      let inquiry=Object.assign({},this.inquiryPayload);
      
      this.itemService.sendReply(this.inquiryPayload).subscribe(data=>{
        this.newlySentReplies.push(inquiry);
        this.sendTo='';
        this.replyMyitems='';
       
       
      },error=>{
        console.log('replying failed');
      });
    }
  }

  removeFromWishlist(itemId,element){
    this.itemService.removeFromWishlist(itemId).subscribe(data=>{
      element.textContent="Removed";
      element.style.background='none';
      element.style.color='#f86d8b';
      console.log('success')
    },error=>{
      element.textContent="error";
      element.style.background='none';
      console.log('failed');

    });

  }

  removeFromMyItems(itemId,element){
    this.itemService.removeFromMyItems(itemId).subscribe(data=>{
      element.textContent="Removed";
      element.style.background='none';
      element.style.color='#f86d8b';
      console.log('success')
    },error=>{
      element.textContent="error";
      element.style.background='none';
      console.log('failed');

    });

  }

  reloadInquiries(itemId){
    this.inquiries=this.itemService.getInquiries(itemId);
    this.replyInWishlist='';
    this.replyMyitems='';
    this.sendTo='';
    this.newlySentInquiries=[];
    this.newlySentReplies=[];
  }
 
}
