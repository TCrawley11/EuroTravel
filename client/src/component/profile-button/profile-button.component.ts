import { Component, HostListener, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative inline-block text-left">
      <!-- Circle Icon -->
      <button
        (click)="toggleDropdown()"
        class="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
        aria-label="Toggle dropdown menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>


      @if (isLoggedIn) {
        @if (isDropdownOpen) {
      <div
        class="absolute right-0 mt-2 w-56 origin-top-right bg-gray-500 divide-y divide-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="px-4 py-3">
          <p routerLink="/lists" class="text-sm font-medium text-gray-700">My Lists</p>
        </div>
        <div class="px-4 py-3">
          <p class="text-sm font-medium text-gray-700">My Profile</p>
        </div>
        <div class="px-4 py-2 flex space-x-4">
          <button
            (click)="signout()"
            class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Sign Out
          </button>
        </div>
      </div> }
      } @else if(!isLoggedIn) {
        @if (isDropdownOpen) {
      <div
        class="absolute right-0 mt-2 w-56 origin-top-right bg-gray-500 divide-y divide-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="px-4 py-3">
          <p routerLink="/lists" class="text-sm font-medium text-gray-700">My Lists
          </p>
        </div>
        <div class="px-4 py-2 flex space-x-4">
          <button
            routerLink = "/signin"
            class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Sign In
          </button>
        </div>
      </div>
      }
    } 
  `,
  styles: [],
})
export class ProfileButtonComponent implements OnInit {
  isDropdownOpen = false;
  isLoggedIn = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private readonly supabase: SupabaseService,
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.supabase.authChanges().subscribe(({ event, session }) => {
      this.isLoggedIn = !!session?.user;
    });
    // check auth on initialization
    this.checkAuthState();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.authSubscription?.unsubscribe();
  }

  private async checkAuthState(): Promise<void> {
    try {
      const { data, error } = await this.supabase.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      this.isLoggedIn = !!data?.session;
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  signout() {
    this.supabase.signOut().then(() => {
      console.log('Signed out successfully');
      // Optionally navigate or update UI
    }).catch(error => {
      console.error('Sign out error:', error);
    });
    window.alert('signed out succesfully');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // click outside of dropdown, then close it
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('app-profile-button');
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}