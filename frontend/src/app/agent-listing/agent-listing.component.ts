import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-agent-listing',
  templateUrl: './agent-listing.component.html',
  styleUrls: ['./agent-listing.component.css']
})
export class AgentListingComponent implements OnInit {

  isLoading:boolean = true;
  imageUrl = environment.imageurl;
  agentCat: any;
  allAgents: any;

  constructor(private service:AppserviceService,private route:ActivatedRoute, private router:Router) { 
    this.route.paramMap.subscribe((params: any) => {
      this.agentCat = params.get('category');
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
    
    window.scroll(0,0);
    this.getAllAgentByCat();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getAllAgentByCat(){
    this.service.get("getAllAgents/"+this.agentCat).subscribe((res:any)=>{
      if(res.success == true){
        this.allAgents = res.data;
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

}
