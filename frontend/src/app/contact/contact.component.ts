import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { AppserviceService } from '../appservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  submitForm:boolean = false;
  isLoading:boolean = true;

  constructor(private fb:FormBuilder,private service:AppserviceService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    window.scroll(0,0);
  }

  contactForm = this.fb.group({
    name:["",[Validators.required]],
    email:["",[Validators.required,Validators.email]],
    subject:["",[Validators.required]],
    message:["",[Validators.required]],
  })

  submitContact(){
    this.isLoading = true;
    if(this.contactForm.valid){
      this.service.post("contactForm",this.contactForm.value).subscribe((res:any)=>{
        if(res.success == true){
          Swal.fire({
            title: 'Success',
            text: res.message,
            icon: 'success',
          });
            this.contactForm.reset();
            this.isLoading = false;
        }else{
          Swal.fire({
            title: 'Error',
            text: res.message,
            icon: 'error',
          });
          this.isLoading = false;
        }
      },error=>{
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
        this.isLoading = false;
      })
    }else{
      this.submitForm = true;
      this.isLoading = false;
    }
  }

}
