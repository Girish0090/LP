import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ListingComponent } from './listing/listing.component';
import { ProjectsingleComponent } from './projectsingle/projectsingle.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CareerComponent } from './career/career.component';
import { AgentListingComponent } from './agent-listing/agent-listing.component';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'about', component:AboutComponent},
  {path:'contact', component:ContactComponent},
  {path:'career', component:CareerComponent},
  {path:'listing', component:ListingComponent},
  {path:'agent-listing/:category', component:AgentListingComponent},
  {path:'agent-detail/agents/:id', component:AgentDetailComponent},
  {path:'gallery', component:GalleryComponent},
  {path:'listing/:type', component:ListingComponent},
  {path:'listing/city/:city', component:ListingComponent},
  {path:'project-detail/:id', component:ProjectsingleComponent},
  {path:'**', component:PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
