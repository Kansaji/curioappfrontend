import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      organization:['',Validators.required],
      description:[''],
      contactDetails:['',Validators.required],
      subject:['',Validators.required],
      expiryDate:['',Validators.required],
    });

    this.advertisementPayload={
      advertisementId:0,
      organization:'',
      description:'',
      contactDetails:'',
      subject:'',
      expiryDate:'',
      postedDate:'',
    }
    this.advertisementPosted=false;
    this.isAdBlocked=false;
   }

  ngOnInit(): void {
    this.allAdvertisements=this.advertisementService.getAllAdvertisements();
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

      this.advertisementService.postAdvertisement(this.advertisementPayload).subscribe(data=>{
        console.log('success');
        this.advertisementPosted=true;
      },error=>{
        this.isAdBlocked=true;
      })
      console.log(this.advertisementPayload);
    }
  }

}
