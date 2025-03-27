import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-button',
  template: `
  @if (!emailSent) {
    <div class="login-container">
        <input 
          type="email" 
          [(ngModel)]="email" 
          (keyup.enter)="login()"
          placeholder="Enter your email"
          class="w-full px-3 py-2 border rounded"
        >
        <button 
          (click)="login()"
          class="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send Magic Link
        </button>
      </div>
    } @else {
      <div class="success-message">
        <p>Check your email for the login link!</p>
        <button 
          (click)="resetForm()"
          class="mt-2 px-4 py-2 bg-gray-200 rounded"
        >
          Send Another Link
        </button>
      </div>
    }
  `,
  standalone: true,
  imports: [FormsModule]
})
export class LoginButtonComponent {
  email = '';
  emailSent = false;

  constructor(
    private readonly supabase: SupabaseService
  ) {}

  async login() {
    if (!this.email || !this.isValidEmail(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const { error } = await this.supabase.signIn(this.email);
      
      if (error) {
        console.error('Error sending magic link:', error);
        alert('Failed to send login link. Please try again.');
        return;
      }

      // If no error, mark email as sent
      this.emailSent = true;
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  // Simple email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetForm() {
    this.email = '';
    this.emailSent = false;
  }
}