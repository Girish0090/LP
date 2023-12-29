import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppserviceService } from '../appservice.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Validators,FormBuilder } from '@angular/forms';
declare var $:any;

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
  submitForm:boolean = false;

  constructor(private route:ActivatedRoute,private service:AppserviceService,private fb:FormBuilder) { 
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
      }
    },error=>{
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        });
    })
  }

  agentQuery = this.fb.group({
    name:["",[Validators.required]],
    email:["",[Validators.required]],
    mobile:["",[Validators.required]],
    agentID:["",[Validators.required]],
    message:[""]
  })

  submitQuery(){
    this.agentQuery.patchValue({"agentID":this.agentId});
    if(this.agentQuery.valid){
      this.service.post("agent-query",this.agentQuery.value).subscribe((res:any)=>{
        if (res.success == true) {
          Swal.fire({
            title: 'Thankyou',
            text: "Thankyou for submitting your detail with us for Agent. our Agent will contact you shortly.",
            imageUrl: '/assets/img/thanks.png',
            imageHeight:"160px",
            showCancelButton: false, 
            showConfirmButton: false
          });
          setTimeout(() => {
            Swal.close();
          }, 3000);
          this.isLoading = false;
          $("#login").modal("hide");
          this.agentQuery.reset();

        } else {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
          Swal.fire({
            title: 'Error',
            text: res.message,
            icon: 'error',
          });
        }
      }, error => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
        });
      })
    } else {
      this.submitForm = true;
      this.isLoading = false;
    }
  }

}
