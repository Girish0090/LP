import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ListingComponent } from './listing/listing.component';
import { ProjectsingleComponent } from './projectsingle/projectsingle.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderModule,NgxUiLoaderHttpModule } from "ngx-ui-loader";
import { LoaderComponent } from './loader/loader.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CareerComponent } from './career/career.component';
import { AgentListingComponent } from './agent-listing/agent-listing.component';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    ListingComponent,
    ProjectsingleComponent,
    PagenotfoundComponent,
    LoaderComponent,
    GalleryComponent,
    CareerComponent,
    AgentListingComponent,
    AgentDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground:true
    }),
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
