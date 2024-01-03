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
  {
    path: '', component: HomeComponent,
    data: {
      title: 'Home - Explore Diverse Properties in India with Laxmiprabhu',
      description: 'Discover a rich variety of residential, commercial, industrial, and villa properties across the enchanting landscapes of India. With Laxmiprabhu as your trusted partner, embark on a seamless and transparent real estate journey.'
    }
  },
  {
    path: 'home', component: HomeComponent,
    data: {
      title: 'Home - Explore Diverse Properties in India with Laxmiprabhu',
      description: 'Discover a rich variety of residential, commercial, industrial, and villa properties across the enchanting landscapes of India. With Laxmiprabhu as your trusted partner, embark on a seamless and transparent real estate journey.'
    }
  },
  {
    path: 'about', component: AboutComponent,
    data: {
      title: 'About Laxmiprabhu - Your Trusted Real Estate Companion',
      description: 'Explore Laxmiprabhu, your dedicated partner. Beyond transactions, we prioritize delivering reliable information, transparency, and personalized care. Join us on a transformative journey to realize your real estate dreams.'
    }
  },
  {
    path: 'contact', component: ContactComponent,
    data: {
      title: 'Contact Laxmiprabhu - Inquiries and Partnership Opportunities',
      description: "Connect with Laxmiprabhu for property inquiries or partnerships. Our dedicated team ensures a seamless experience, offering information, expertise, and personalized service tailored to your real estate needs."
    }
  },
  {
    path: 'career', component: CareerComponent,
    data: {
      title: 'Career with Laxmiprabhu - Join Our Team for Real Estate Success',
      description: "Explore exciting opportunities to join Laxmiprabhu's dynamic team. Contribute to our mission of providing top-notch real estate services. We value innovation, collaboration, and dedication, creating an environment where your skills thrive. Join us for a fulfilling career journey in real estate."
    }
  },
  {
    path: 'listing', component: ListingComponent,
    data: {
      title: 'Explore Listings - Find Your Perfect Property with Laxmiprabhu',
      description: "Discover a variety of property listings with Laxmiprabhu. Whether you're looking for a cozy home or a thriving commercial space, our platform makes finding your ideal property easy. With Laxmiprabhu, your journey to the perfect property is seamless, transparent, and tailored to your preferences."
    }
  },
  {
    path: 'agent-listing/:category', component: AgentListingComponent,
    data: {
      title: 'Agent Listings - Explore Properties with Laxmiprabhu Agents',
      description: "Discover properties with Laxmiprabhu's trusted agents. Navigate the real estate journey with expert advice and personalized assistance. Trust our agents to guide you through a diverse range of property options."
    }
  },
  {
    path: 'agent-detail/agents/:id', component: AgentDetailComponent,
    data: {
      title: 'Agent Details - Explore Profiles of Laxmiprabhu Agents',
      description: "Dive into the details of our accomplished agents at Laxmiprabhu. Gain insights into their expertise and achievements in the real estate industry. Our agent profiles provide comprehensive information, allowing you to make informed decisions and choose the right partner for your real estate journey."
    }
  },
  {
    path: 'gallery', component: GalleryComponent,
    data: {
      title: 'Property Gallery - Visual Delight with Laxmiprabhu Images',
      description: 'Immerse yourself in the visual charm of properties listed with Laxmiprabhu. Explore an array of stunning images showcasing available residential, commercial, and industrial spaces. Our gallery offers a captivating preview, allowing you to envision your future in these exceptional properties.'
    }
  },
  {
    path: 'listing/:type', component: ListingComponent,
    data: {
      title: 'Listing Detail - Explore Details of the Property with Laxmiprabhu',
      description: 'Embark on a detailed exploration of a specific property with Laxmiprabhu. Uncover features, specifications, and precise location details. This comprehensive insight empowers you to make well-informed decisions, ensuring the property aligns perfectly with your unique preferences, aspirations, and future plans.'

    }
  },
  {
    path: 'listing/city/:city', component: ListingComponent,
    data: {
      title: 'Listings by City - Discover Properties with Laxmiprabhu',
      description: 'Explore property listings conveniently sorted by city with Laxmiprabhu. Find a diverse range of real estate options in your preferred city or location, ensuring you discover the perfect property that suits your lifestyle and preferences.'
    }
  },
  {
    path: 'project-detail/:id', component: ProjectsingleComponent,
    data: {
      title: 'Project Detail - Explore This Property Project with Laxmiprabhu',
      description: "Delve into the unique details of a specific property project with Laxmiprabhu. Understand the project's exclusive features, premium amenities, and prime location. Our comprehensive insights empower you to make well-informed decisions, ensuring the project perfectly aligns with your preferences and lifestyle."
    }
  },
  {
    path: '**', component: PagenotfoundComponent,
    data: {
      title: 'Page Not Found - Navigate Further and Beyond with Laxmiprabhu',
      description: "Oops! You've stumbled upon an undiscovered corner. Turn this unexpected detour into a journey of boundless exploration with Laxmiprabhu. Discover extensive listings, each a unique tapestry of potential. Navigate further with us!"
    }
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
