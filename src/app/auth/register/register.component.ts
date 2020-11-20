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
  

  constructor(private formBuilder:FormBuilder, private authService:AuthService, private router:Router) {
    this.registerForm = this.formBuilder.group({
      username:['',[Validators.required, Validators.minLength(4)]],
      email:['',[Validators.required, this.emailValidator]],
      telephone:['',[Validators.required, Validators.minLength(9)]],
      password:['',[Validators.required, Validators.minLength(8)]],
      confirmPassword:['',[Validators.required, this.passwordValidator]]
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
      telephone:'',
      password:'',
    }
    this.usernameTaken=false;
    this.username='';
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.registerForm.markAllAsTouched();
    
    if(this.registerForm.valid){
      this.registerPaylord.username = this.registerForm.get('username').value;
      this.registerPaylord.email = this.registerForm.get('email').value;
      this.registerPaylord.telephone = this.registerForm.get('telephone').value;
      this.registerPaylord.password = this.registerForm.get('password').value;
      this.username=this.registerForm.get('username').value;
     
      this.authService.register(this.registerPaylord).subscribe(data=>{
        this.router.navigateByUrl('/register-success');
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
}
