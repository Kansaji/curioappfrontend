import { Injectable } from "@angular/core";
import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent} from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import {Observable} from 'rxjs';

@Injectable()
export class HttpClientInterseptor implements HttpInterceptor{
    constructor(private $localStorage: LocalStorageService){}

    intercept(req: HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
        const token= this.$localStorage.retrieve('authenticationToken');
        console.log('jwt loken '+ token);
        if(token){
            const cloned = req.clone({headers:req.headers.set("Authorization","Bearer "+token)
        });
        return next.handle(cloned);
        }
        else{
            return next.handle(req);
        }
    }
}
