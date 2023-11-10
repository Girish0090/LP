import { Component, OnInit } from '@angular/core';
declare var citylocation:any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
