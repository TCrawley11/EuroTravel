import { Component, signal, Signal } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-user-profile',
  template: `
    `,
  standalone: true,
  imports: [NgIf, AsyncPipe]
})
export class UserProfileComponent {
  constructor(public readonly supabase: SupabaseService) {

  }
}