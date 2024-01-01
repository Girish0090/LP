import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  waitLoader: boolean = false;
  loaderStatus:boolean = true;

  constructor(private http:HttpClient, private titleservice: Title, private metaservice: Meta, @Inject(DOCUMENT) private dom:any) { }

  get(url:any){
    return this.http.get(environment.siteUrl+url);
  }

  post(url:any,data:any){
    return this.http.post(environment.siteUrl+url,data);
  }

  setTitle(value: string) {
    this.titleservice.setTitle(value);
  }

  setMetaTags(value: any) {
    this.metaservice.updateTag(value);
  }

  createCanonicalURL(url:any) {
    let links = this.dom.getElementsByTagName("link");
    links[1].setAttribute('href', "https://www.laxmiprabhu.com"+url);
  }
}
