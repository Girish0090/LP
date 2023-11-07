import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
declare var gallerypage: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  isLoading: boolean = true;
  allImages: any;
  imageUrl = environment.imageurl;

  constructor(private service: AppserviceService) { }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 1000);
    this.getAllImages();
    window.scroll(0, 0);
  }

  getAllImages() {
    this.isLoading = true;
    this.service.get("getGalleryImages").subscribe((res: any) => {
      if (res.success == true) {
        this.allImages = res.data;
        gallerypage();
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
    }, error => {
      this.isLoading = false;
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    })
  }

}
