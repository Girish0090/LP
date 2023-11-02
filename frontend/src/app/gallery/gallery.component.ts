import { Component, OnInit } from '@angular/core';
declare var gallerypage:any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  isLoading:boolean = true;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    
    gallerypage();
    
    window.scroll(0,0);
  }

}
