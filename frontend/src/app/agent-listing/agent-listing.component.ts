import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private service:AppserviceService,private route:ActivatedRoute) { 
    this.route.paramMap.subscribe((params: any) => {
      this.agentCat = params.get('category');
    })
  }

  ngOnInit(): void {
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
