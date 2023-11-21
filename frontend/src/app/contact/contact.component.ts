import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppserviceService } from '../appservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  submitForm: boolean = false;
  isLoading: boolean = true;

  constructor(private fb: FormBuilder, private service: AppserviceService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    window.scroll(0, 0);
  }

  contactForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.email]],
    subject: ["", [Validators.required]],
    message: ["", [Validators.required]],
    mobile: ["", [Validators.required]],
  })

  submitContact() {
    this.isLoading = true;
    if (this.contactForm.valid) {
      this.service.post("contactForm", this.contactForm.value).subscribe((res: any) => {
        if (res.success == true) {
          Swal.fire({
            title: 'Thankyou',
            text: "Thankyou for submitting your detail with us for our project. our team will contact you shortly.",
            imageUrl: '/assets/img/thanks.png',
            imageHeight:"160px",
            showCancelButton: false, 
            showConfirmButton: false
          });
          setTimeout(() => {
            Swal.close();
          }, 3000);
          this.isLoading = false;
          this.contactForm.reset();

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
