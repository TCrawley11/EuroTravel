import { Component, computed, signal, Signal } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginButtonComponent } from '../my-auth/login-button';
import { LogoutButtonComponent } from "../my-auth/logout-button";
import { SupabaseService } from '../../services/supabase.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileButtonComponent } from "../profile-button/profile-button.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    ProfileButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  mobileMenuOpen = false;

  // Signals to manage state
  username = signal('Guest');
  authstatus = signal(false);

  private authSubscription!: Subscription;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.supabase.authChanges().subscribe(({ event, session }) => {
      this.authstatus.set(!!session?.user);

      if (session?.user) {
        // Fetch the profile to get the username
        this.supabase.profile(session.user).then(({ data, error }) => {
          if (data) {
            this.username.set(data.username || 'Guest');
          } else if (error) {
            console.error('Error fetching profile:', error);
            this.username.set('Guest');
          }
        });
      } else {
        this.username.set('Guest');
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Greeting computed property
  greeting = computed(() => {
    const name = this.username();
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 5) return `Still up, ${name}?`;
    if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
    if (hour >= 12 && hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  });

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}