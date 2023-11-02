import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { AppserviceService } from './appservice.service';
import { transition, trigger, query, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('myAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [style({ opacity: 0 })],
          { optional: true }
        ),
        query(
          ':leave',
          [style({ opacity: 1 }), animate('150ms', style({ opacity: 0 }))],
          { optional: true }
        ),
        query(
          ':enter',
          [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))],
          { optional: true }
        )
      ])
    ])
    
  ]

})
export class AppComponent {
  title = 'myCarWeek';

  display: boolean = true;
  loader: boolean = false;

  constructor(private service: AppserviceService, public router: Router, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformid: object) {

    if (!isPlatformBrowser(this.platformid)) {
      this.display = false;
    }

    this.router.events.subscribe((routerEvent: RouterEvent) => {

      if (routerEvent instanceof NavigationStart) {
        this.service.loaderStatus = true;
        this.cdr.detectChanges();
        this.loader = true;
      }

      if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
        this.service.loaderStatus = false;
        this.cdr.detectChanges();
        this.loader = true;
      }
    });

  }

  get waitLoader() {
    return this.service.waitLoader;
  }

 
}
