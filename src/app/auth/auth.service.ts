import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RegisterPaylord } from './register-paylord';
import { Observable } from 'rxjs';
import { LoginPaylord } from './login-paylord';
import { JwtAuthResponse } from './jwt-auth-response';
import { LocalStorageService } from 'ngx-webstorage';
import{map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = "http://localhost:8080/"
  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) { }

  register(registerPaylord:RegisterPaylord):Observable<any>{
    return this.httpClient.post(this.url+"api/auth/signup",registerPaylord)
  }

  login(loginPaylord:LoginPaylord):Observable<boolean>{
    return this.httpClient.post<JwtAuthResponse>(this.url+"api/auth/login",loginPaylord).pipe(map(data=>{
      this.localStorageService.store('authenticationToken',data.authenticationToken);
      this.localStorageService.store('username',data.username);
      return true;

    }));
  }

  isAuthenticated():Boolean{
    return this.localStorageService.retrieve('username')!= null;
  }

  logout(){
    this.localStorageService.clear('authenticationToken');
    this.localStorageService.clear('username');
  }

}
