import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
declare var citylocation:any;

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
  isLoading:boolean = true;
  imageUrl = environment.imageurl;

  constructor(private service:AppserviceService,private router:Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
    this.getAllSlider();
    this.getAllProjects();
    this.getReviews();
    window.scroll(0,0);
  }

  getAllSlider(){
    this.service.get("getBanner").subscribe((res:any)=>{
      if(res.success == true){
        this.sliderList = res.data;
        setTimeout(() => {
          citylocation();
        }, 500);
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

  getAllProjects(){
    this.service.get("getAllProperty").subscribe((res:any)=>{
      if(res.success == true){
        this.allProjects = res.data;
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

  getProjectbycat(event:any){
    this.service.get("getPropertyByCat/"+event).subscribe((res:any)=>{
      if(res.success == true){
        this.propertyList = res.data;
        this.router.navigateByUrl("/listing/"+event);
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

  getProjectByCity(event:any){
    this.service.get("getPropertyByCity/"+event.target.value).subscribe((data:any)=>{
      if(data.success == true){
        this.router.navigateByUrl("/listing/city/"+event.target.value);
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

  getReviews(){
    this.service.get("getAllReviews").subscribe((res:any)=>{
      if(res.success == true){
        this.getAllReviews = res.data;
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

  getAllAgent(category:any){
    this.router.navigateByUrl("/agent-listing/"+category);
  }

}
