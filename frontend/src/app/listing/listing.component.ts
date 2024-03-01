import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
declare var filter: any;
declare var $: any;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  projectList: any;
  Category: any;
  isLoading: boolean = true;
  imageUrl = environment.imageurl;
  p: number = 1;
  selectedMin: any;
  selectedMax: any;
  City: any;
  location:any;
  submitForm: boolean = false;

  constructor(private service: AppserviceService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.route.paramMap.subscribe((params: any) => {
      this.Category = params.get('type');
      this.City = params.get('city');
      this.location = params.get('location');
      if (this.Category) {
        this.getProjectByCat();
      } else if (this.City) {
        this.getProjectByCity();
      } else {
        this.getAppProjects();
      }
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
    
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 1000);
    window.scroll(0, 0);
    filter();
  }

  getProjectByCat() {
    this.service.get("getPropertyByCat/" + this.Category).subscribe((res: any) => {
      this.isLoading = true;
      if (res.success == true) {
        this.projectList = res.data;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
    }, error => {
      this.isLoading = false;
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    })
  }

  getAppProjects() {
    this.service.get("getAllProperty").subscribe((res: any) => {
      this.isLoading = true;
      if (res.success == true) {
        this.projectList = res.data;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
    }, error => {
      this.isLoading = false;
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    })
  }

  filterbycategory(event: any) {
    this.isLoading = true;
    if (event.target.value == "Residential" || event.target.value == "Commercial" || event.target.value == "Industrial" || event.target.value == "Villa") {
      this.service.get("getFilterProperty?categoryName=" + event.target.value).subscribe((res: any) => {
        this.isLoading = true;
        if (res.success == true) {
          this.projectList = res.data;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      }, error => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      })
    } else if (event.target.value == "Sold/Resale" || event.target.value == "Sale") {
      this.service.get("getFilterProperty?status=" + event.target.value).subscribe((res: any) => {
        if (res.success == true) {
          this.projectList = res.data;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
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
      const target = event.target as HTMLSelectElement;
      const selectedOption = target.options[target.selectedIndex];

      if (selectedOption) {
        const minAttribute = selectedOption.getAttribute('min');
        const maxAttribute = selectedOption.getAttribute('max');

        if (minAttribute !== null && maxAttribute !== null) {
          this.selectedMin = parseInt(minAttribute);
          this.selectedMax = parseInt(maxAttribute);
        }
        this.service.get("getFilterProperty?minPrice=" + this.selectedMin + "&maxPrice=" + this.selectedMax).subscribe((res: any) => {
          if (res.success == true) {
            this.projectList = res.data;
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
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
        this.selectedMin = null;
        this.selectedMax = null;
        this.isLoading = false;
      }
    }
  }

  getSorting(event: any) {
    this.isLoading = true;
    if (event == "Relevance") {
      this.getAppProjects();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    } else {
      this.service.get("getSortProperty?order=" + event).subscribe((res: any) => {
        if (res.success == true) {
          this.projectList = res.data;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      }, error => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      })
    }
  }

  getProjectByCity() {
    this.isLoading = true;
    if(!this.location){
      this.service.get("getPropertyByCity/" + this.City).subscribe((res: any) => {
        if (res.success == true) {
          this.projectList = res.data;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      }, error => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      })
    }else{
       this.service.get("getPropertiesByLocation/"+this.City+"/"+this.location).subscribe((data: any) => {
        if (data.success == true) {
          console.log(data)
          this.projectList = data.data;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      }, error => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      })
    }
  }

  contactProject = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    mobile: ["", [Validators.required]],
    projectID: ["", [Validators.required]]
  })

  ProjectContact(id: any) {
    this.contactProject.patchValue({ projectID: id });
  }

  contact() {
    if (this.contactProject.valid) {
      this.isLoading = true;
      this.service.post("projectContact/", this.contactProject.value).subscribe((res: any) => {
        if (res.success == true) {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
          Swal.fire({
            title: 'Success',
            text: res.message,
            icon: 'success',
          });
          $("#login").modal("hide");
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
