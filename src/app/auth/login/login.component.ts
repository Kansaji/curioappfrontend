import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,AbstractControl} from '@angular/forms';
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
      username:['',[Validators.required,this.stringValidator]],
      password:['',[Validators.required,this.stringValidator]],
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
      this.loginPaylord.username=this.loginForm.get('username').value.trim();
      this.loginPaylord.password=this.loginForm.get('password').value.trim();
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
