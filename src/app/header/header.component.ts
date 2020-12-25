import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username:String='';
  itemsPosted:number=0;
  inquiriesMade:number=0;
  inquiriesReveived:number=0;
  itemsInWishlist:number=0
 
   
  constructor(public authService:AuthService,private localStorageService: LocalStorageService, private router:Router, private itemService: ItemService) {
    this.username=this.localStorageService.retrieve('username');
   }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout();
    this.username='';
    this.router.navigateByUrl("/login");
  }

  getMyStats(){
    this.itemService.getMyStats().subscribe(data=>{
      this.itemsPosted=data.itemsPosted;
      this.inquiriesMade=data.inquiriesMade;
      this.inquiriesReveived=data.inquiriesReveived;
      this.itemsInWishlist=data.itemsInWishlist;
    },error=>{
      console.log("stats not received");
      
    });
  }
}
