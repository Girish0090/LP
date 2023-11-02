import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  waitLoader: boolean = false;
  loaderStatus:boolean = true;

  constructor(private http:HttpClient) { }

  get(url:any){
    return this.http.get(environment.siteUrl+url);
  }

  post(url:any,data:any){
    return this.http.post(environment.siteUrl+url,data);
  }
}
