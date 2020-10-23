import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegisterPaylord } from '../register-paylord';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  registerPaylord: RegisterPaylord;

  constructor(private formBuilder:FormBuilder, private authService:AuthService) {
    this.registerForm = this.formBuilder.group({
      username:'',
      email:'',
      telephone:'',
      password:''
    });

    this.registerPaylord={
      username:'',
      email:'',
      telephone:'',
      password:'',
    }
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.registerPaylord.username = this.registerForm.get('username').value;
    this.registerPaylord.email = this.registerForm.get('email').value;
    this.registerPaylord.telephone = this.registerForm.get('telephone').value;
    this.registerPaylord.password = this.registerForm.get('password').value;
    console.log(this.registerPaylord);
    this.authService.register(this.registerPaylord).subscribe(data=>{
      console.log("register success");
    },error=>{
      console.log("register failed");
    });
  }
}
