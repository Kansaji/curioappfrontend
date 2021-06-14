import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdvertisementService } from '../advertisement.service';
import { AdvertisementPayload } from './advertisementPayload';
import {DatePipe} from '@angular/common'; 
@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css'],
  providers:[DatePipe]
})
export class AdvertisementsComponent implements OnInit {

  advertisementForm:FormGroup;
  advertisementPayload:AdvertisementPayload;
  allAdvertisements:Observable<Array<AdvertisementPayload>>;
  advertisementPosted:boolean;

  isAdBlocked:boolean;

  constructor(private formBuilder:FormBuilder, private advertisementService:AdvertisementService, private datePipe:DatePipe) {
    this.advertisementForm=this.formBuilder.group({
      advertisementId:[0],
      organization:' ',
      description:['',[Validators.required,this.stringValidator]],
      contactDetails:['',[Validators.required,this.stringValidator]],
      subject:['',[Validators.required,this.stringValidator]],
      expiryDate:['',[Validators.required,this.stringValidator]],
    });

    this.advertisementPayload={
      advertisementId:0,
      organization:'',
      description:'',
      contactDetails:'',
      subject:'',
      expiryDate:'',
      postedDate:'',
      postedUser:'',
    }
    this.advertisementPosted=false;
    this.isAdBlocked=false;
   }

  ngOnInit(): void {
    this.allAdvertisements=this.advertisementService.getAllDonationRequests();
    console.log("observable array");
    console.log(this.allAdvertisements);
  }

  onSubmit(){
    this.advertisementForm.markAllAsTouched();
    this.isAdBlocked=false;
    if(this.advertisementForm.valid){
      this.advertisementPayload.organization=this.advertisementForm.get('organization').value;
      this.advertisementPayload.description=this.advertisementForm.get('description').value;
      this.advertisementPayload.contactDetails=this.advertisementForm.get('contactDetails').value;
      this.advertisementPayload.subject=this.advertisementForm.get('subject').value;
      this.advertisementPayload.expiryDate=this.advertisementForm.get('expiryDate').value;
      this.advertisementPayload.postedDate=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');

      this.advertisementService.postDonationRequest(this.advertisementPayload).subscribe(data=>{
        console.log('success');
        this.advertisementPosted=true;
      },error=>{
        this.isAdBlocked=true;
      })
      console.log(this.advertisementPayload);
    }
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
}
