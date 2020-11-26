import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginPaylord } from '../login-paylord';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginPaylord:LoginPaylord;
  invalidCredentials:boolean;

  constructor(private formBuilder: FormBuilder, private authService:AuthService, private router:Router) { 

    this.loginForm = this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required],
    });

    this.loginPaylord={
      username:"",
      password:""
    }
    this.invalidCredentials=false;
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid){
      this.loginPaylord.username=this.loginForm.get('username').value;
      this.loginPaylord.password=this.loginForm.get('password').value;
      this.authService.login(this.loginPaylord).subscribe(data=>{
      if(data){
        this.router.navigateByUrl("/home");
      }
    },error=>{
      this.invalidCredentials=true;
      console.log('login failed');
    })
    }else{
      
    }
    
  }
}
