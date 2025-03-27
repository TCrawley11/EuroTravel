import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../component/header/header.component';
import { HomeComponent } from '../component/home/home.component';
import { SupabaseService } from '../services/supabase.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from "../component/account/account.component";
import { AuthComponent } from "../component/auth/auth.component";
import { Subscription } from 'rxjs';
import { AboutComponent } from '../component/about/about.component';
import { MapComponent } from "../component/map/map.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HomeComponent,
    HeaderComponent,
    ReactiveFormsModule,
    AccountComponent,
    AuthComponent,
    AboutComponent,
    MapComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';
  session: any = null;

  private authSubscription!: Subscription;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.supabase.authChanges().subscribe(({ session }) => {
      this.session = session;
    });

    // Check the current session
    this.supabase.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Error fetching session:', error);
        this.session = null;
      } else {
        this.session = data.session;
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
