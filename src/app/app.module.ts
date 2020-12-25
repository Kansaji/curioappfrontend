import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterSuccessComponent } from './auth/register-success/register-success.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HomeComponent } from './home/home.component';
import { HttpClientInterseptor } from './http-client-interceptor';
import { ItemsComponent } from './items/items.component';
import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    RegisterSuccessComponent,
    HomeComponent,
    ItemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    RouterModule.forRoot([
      {path:'register',component: RegisterComponent},
      {path:'login',component: LoginComponent},
      {path:'register-success',component: RegisterSuccessComponent, canActivate:[AuthGuard]},
      {path:'home',component: HomeComponent, canActivate:[AuthGuard]},
      {path:'items',component: ItemsComponent, canActivate:[AuthGuard]}
    ])
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpClientInterseptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
