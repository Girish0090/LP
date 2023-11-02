import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
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

  constructor(private service:AppserviceService,private route:ActivatedRoute) { 
    this.route.paramMap.subscribe((params:any)=>{
      this.projectid =  params.get('id');
   })
  }

  ngOnInit(): void {
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
      console.log(error);
    })
  }

}
