import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppserviceService } from '../appservice.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit {
  isLoading: boolean = true;
  agentId: any;
  agentDetail: any;
  imageUrl = environment.imageurl;

  constructor(private route:ActivatedRoute,private service:AppserviceService) { 
    this.route.paramMap.subscribe((params: any) => {
      this.agentId = params.get('id');
    })
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.getAgentDetail();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getAgentDetail(){
    this.service.get("getAgentDetail/"+this.agentId).subscribe((res:any)=>{
      if(res.success == true){
        this.agentDetail = res.data[0];
        console.log(this.agentDetail);
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
