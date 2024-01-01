import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AppserviceService } from '../appservice.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  pdf: any;
  isLoading: boolean = true;
  submitForm: boolean = false;

  constructor(private fb: FormBuilder, private service: AppserviceService,private route:ActivatedRoute, private router:Router) { }

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
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  careerForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required]],
    mobile: ["", [Validators.required]],
    education_Level: ["", [Validators.required]],
    additional_Msg: ["", [Validators.required]]
  })

  onSelectFile(event: any) {
    this.pdf = event.target.files[0];
  }

  submitCareerForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('name', this.careerForm.value.name);
    formData.append('email', this.careerForm.value.email);
    formData.append('mobile', this.careerForm.value.mobile);
    formData.append('education_Level', this.careerForm.value.education_Level);
    formData.append('additional_Msg', this.careerForm.value.additional_Msg);
    formData.append('resumePDF', this.pdf, this.pdf?.name);

    if (this.careerForm.valid) {
      this.service.post("joinUs", formData).subscribe((res: any) => {
        if (res.success == true) {
          $("#career").modal("hide");
          Swal.fire({
            title: 'Thankyou',
            text: "Thankyou for submitting your detail with us. we will contact you shortly.",
            imageUrl: '/assets/img/thanks.png',
            imageHeight:"160px",
            showCancelButton: false, 
            showConfirmButton: false
          });
          setTimeout(() => {
            Swal.close();
          }, 3000);
          this.careerForm.reset();
          this.isLoading = false;
        } else {
          this.isLoading = false;
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
          text: error.message,
          icon: 'error',
        });
      })
    } else {
      this.submitForm = true;
      this.isLoading = false;
    }

  }

}
