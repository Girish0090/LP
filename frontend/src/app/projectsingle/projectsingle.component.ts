import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var $:any;
declare var detailCarousel:any;

@Component({
  selector: 'app-projectsingle',
  templateUrl: './projectsingle.component.html',
  styleUrls: ['./projectsingle.component.css']
})
export class ProjectsingleComponent implements OnInit {
  projectDetail: any;
  projectid: any;
  isLoading: boolean = true;
  imageUrl = environment.imageurl;

  constructor(private service:AppserviceService,private route:ActivatedRoute, private router:Router) { 
    this.route.paramMap.subscribe((params:any)=>{
      this.projectid =  params.get('id');
   })
  }

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
    
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    window.scroll(0,0);
    $('.modal-backdrop').hide();
    this.getprojectDetail();
  }

  getprojectDetail(){
    this.service.get("getPropertyDetail/"+this.projectid).subscribe((res:any)=>{
      if(res.success == true){
        this.projectDetail = res.data[0];
        setTimeout(() => {
          detailCarousel();
        }, 300);
      }
    },error=>{
      this.isLoading = false;
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    })
  }

}
