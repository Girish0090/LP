import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
declare var citylocation: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sliderList: any;
  allProjects: any;
  propertyList: any;
  getAllReviews: any;
  isLoading: boolean = true;
  imageUrl = environment.imageurl;

  constructor(private service: AppserviceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.data.subscribe((data:any) => {
      if (data.title) {
        this.service.setTitle(data.title);
        this.service.setMetaTags({
          property: "og:title",
          content: data.title,
        });
      }

      if (data.description) {
        this.service.setMetaTags({
          name: "description",
          content: data.description,
        });
        this.service.setMetaTags({
          property: "og:description",
          content: data.description,
        });
      }
      this.service.createCanonicalURL(this.router.url);

    })

    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 2000);
    this.getAllSlider();
    this.getAllProjects();
    this.getReviews();
    window.scroll(0, 0);

  }

  getAllSlider() {
    this.isLoading = true;
    this.service.get("getBanner").subscribe((res: any) => {
      if (res.success == true) {
        this.sliderList = res.data;
        setTimeout(() => {
          citylocation();
        }, 500);
        setTimeout(() => {
          this.isLoading = false;

          
    $('.home-slider').slick({
      centerMode: false,
      slidesToShow: 1,
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: true,
          slidesToShow: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 1
        }
      }
      ]
    });
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

  getAllProjects() {
    this.isLoading = true
    this.service.get("getAllProperty").subscribe((res: any) => {
      if (res.success == true) {
        this.allProjects = res.data;
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

  getProjectbycat(event: any) {
    this.service.get("getPropertyByCat/" + event).subscribe((res: any) => {
      if (res.success == true) {
        this.propertyList = res.data;
        this.router.navigateByUrl("/listing/" + event);
      }
    }, error => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    })
  }

  getProjectByCity(event: any) {
    this.service.get("getPropertyByCity/" + event.target.value).subscribe((data: any) => {
      if (data.success == true) {
        this.router.navigateByUrl("/listing/city/" + event.target.value);
      }
    }, error => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    })
  }

  getReviews() {
    this.isLoading = true;
    this.service.get("getAllReviews").subscribe((res: any) => {
      if (res.success == true) {
        this.getAllReviews = res.data;
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

  getAllAgent(category: any) {
    this.router.navigateByUrl("/agent-listing/" + category);
  }

}
