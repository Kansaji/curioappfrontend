import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RegisterPaylord } from '../register-paylord';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  registerPaylord: RegisterPaylord;
  usernameTaken:boolean;
  username:string;
  registrationSuccessful:boolean;
  

  constructor(private formBuilder:FormBuilder, private authService:AuthService, private router:Router) {
    this.registerForm = this.formBuilder.group({
      username:['',[Validators.required, Validators.minLength(4),this.stringValidator]],
      email:['',[Validators.required, this.emailValidator]],
      password:['',[Validators.required, Validators.minLength(8),this.stringValidator]],
      confirmPassword:['',[Validators.required, this.passwordValidator,this.stringValidator]]
    });
    this.registerForm.controls.password.valueChanges.subscribe(
      x => this.registerForm.controls.confirmPassword.updateValueAndValidity()
    )
    this.registerForm.controls.username.valueChanges.subscribe(
      x => {this.usernameTaken=false}
    )

    this.registerPaylord={
      username:'',
      email:'',
      password:'',
    }
    this.usernameTaken=false;
    this.username='';
    this.registrationSuccessful=false;
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.registerForm.markAllAsTouched();
    
    if(this.registerForm.valid){
      this.registerPaylord.username = this.registerForm.get('username').value.trim();
      this.registerPaylord.email = this.registerForm.get('email').value.trim();
      this.registerPaylord.password = this.registerForm.get('password').value.trim();
      this.username=this.registerForm.get('username').value;
     
      this.authService.register(this.registerPaylord).subscribe(data=>{
        this.registrationSuccessful=true;
      },error=>{
        console.log('register failed')
        this.usernameTaken=true;
      });
    }else{
      
    }
  }

  emailValidator(control: AbstractControl){
    if(control && (control.value!==null || control.value!== undefined)){
      const regex = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$');
      if(!regex.test(control.value)){
        return{
          isError:true
        };
      }
    }
    return null;
  }

  passwordValidator(control: AbstractControl){
    if(control && (control.value!==null || control.value!== undefined)){
      const cnfpassValue = control.value;
      const passControl = control.root.get('password')
      if(passControl){
        const pssValue = passControl.value;
        if(pssValue !== cnfpassValue || pssValue===''){
          return{
            isError: true
          }
        }
      }
    }
    return null;
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
