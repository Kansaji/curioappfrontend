import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
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
      itemName:['',[Validators.required, this.stringValidator]],
      type:['',Validators.required],
      description:['',[Validators.required, this.stringValidator]],
      quality:['',Validators.required],
      photo:['',Validators.required],
      sale:[''],
      donation:[''],
      exchange:[''],
      renting:['']
    });

    this.itemPaylord={
      itemId:0,
      itemName:'',
      type:'',
      description:'',
      quality:'',
      photo:'',
      postedUser:'',
      sale:'',
      donation:'',
      exchange:'',
      renting:'',
      likes:0,
      postedTimeStamp:'',
      soldFlag:''
    };

    this.sendInquiryForm=this.formBuilder.group({
      message:['',[Validators.required,this.stringValidator]]
    });
    this.sendReplyForm=this.formBuilder.group({
      reply:['',[Validators.required, this.stringValidator]]
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
      timeStamp:'',
      inquiryId:0

    } 
    
    this.itemService.GeolocationPosition().then(pos=>{
      this.itemService.updateCurrentGeolocation(pos.longitude,pos.latitude).subscribe(res=>{
        console.log('location successfully updated');
        
      },error=>{
        console.log('location update failed')
      });
    }).catch(
      (err)=>{
        console.log('Could not access location');
        

      }
    );
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
      this.itemPaylord.quality=this.addItemForm.get('quality').value;
      this.itemPaylord.photo=this.base64textString;

      this.itemPaylord.sale=this.addItemForm.get('sale').value;
      this.itemPaylord.donation=this.addItemForm.get('donation').value;
      this.itemPaylord.exchange=this.addItemForm.get('exchange').value;
      this.itemPaylord.renting=this.addItemForm.get('renting').value;
      this.itemPaylord.postedTimeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');

      console.log(this.base64textString);
      this.itemService.addItem(this.itemPaylord).subscribe(data=>{
       this.isSuccess=true;
        
      },error=>{
        console.log("post item failed");
        this.isSuccess=false;
        console.log(this.itemPaylord);
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
    this.myItems=this.itemService.getMyItems();
  }

  showWishlist(){
    this.wishlistSelected=true;
    this.myItemsSelected=false;
    this.wishlist=this.itemService.getWishlist();
  
  }

  sendInquiry(itemId){
   var message=this.sendInquiryForm.get('message').value
   if(message!="" && this.sendInquiryForm.valid){
     if(this.replyInWishlist!=''){
      message="<i><h6>"+this.replyInWishlist+"</h6></i><hr>"+message;
     }

    this.inquiryPayload.message=message;
    this.inquiryPayload.itemId=itemId;
    this.inquiryPayload.from='';
    this.inquiryPayload.to=this.sendTo;
    this.inquiryPayload.timeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');
    this.inquiryPayload.inquiryId=0;
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
      this.replyInWishlist=message+' : '+user;
   
  }
  deletementionMessageInWishlist(){
    this.replyInWishlist=''
  }

  MentionMessageInMyItems(user,message){
      this.replyMyitems=message+' : '+ user;
   
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
    if(reply!=''&& this.sendTo!='' && this.sendReplyForm.valid){
      if(this.replyMyitems!=''){
      reply="<i><h6>"+this.replyMyitems+"</h6></i><hr>" + reply;
      }
      this.inquiryPayload.message=reply;
      this.inquiryPayload.itemId=itemId;
      this.inquiryPayload.from='';
      this.inquiryPayload.to=this.sendTo;
      this.inquiryPayload.timeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');
      this.inquiryPayload.inquiryId=0;
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
 
  removeInquiry(inquiryId,element){
    
    this.itemService.removeInquiry(inquiryId).subscribe(data=>{
      element.textContent="removed";
     
    },error=>{
      element.textContent="error";
    });
  }

  stringValidator(control: AbstractControl){
    if(control && (control.value!==null || control.value!== undefined)){
      const regex = new RegExp("^\\s+$");
      if(regex.test(control.value)){
        return{
          isError:true
        };
      }
    }
    return null;
  }


  setAsSold(itemId){
   
    this.setSoldFlag(itemId,'Sold');
  }

  setAsDonated(itemId){
   
    this.setSoldFlag(itemId,'Donated');
  }

  setAsExchanged(itemId){
   
    this.setSoldFlag(itemId,'Exchanged');
  }  

  setAsRented(itemId){
   
    this.setSoldFlag(itemId,'Rented');
  }

  setAsAvailable(itemId){
   
    this.setSoldFlag(itemId,'Available');
  }

  setSoldFlag(itemId,flag){
    this.itemService.setSoldFlag(itemId,flag).subscribe(data=>{
      
      var flagText=document.getElementById('sold-Flag'+itemId);
      flagText.innerText= flag;
      if(flag==='Available'){
        flagText.style.background="#0be881";
      }else{
        flagText.style.background="#ffd32a";
      }
      
    
     
    },error=>{
      console.log("error");
    });
  }
}
