import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppserviceService } from '../appservice.service';
declare var citylocation:any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private service:AppserviceService,private route:ActivatedRoute, private router:Router) { }

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
      citylocation();
    }, 1000);
    window.scroll(0,0);
  }

  showFullText: boolean = false;

  toggleText() {
    this.showFullText = !this.showFullText;
  }

}
