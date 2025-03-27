import { Component, Inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-logout-button',
  template: `
    <a 
      (click)="logout()"
      class="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
    >
    Log Out
    </a>
  `,
  imports: [CommonModule],
  standalone: true
})
export class LogoutButtonComponent {
  constructor(
    private readonly supabase: SupabaseService,
  ) {}

  async logout() {
    await this.supabase.signOut();
  }
}