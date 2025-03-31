import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const user = await this.supabaseService.getCurrentUser();
      
      if (user) {
        return true;
      }
      
      // Redirect to login page
      this.router.navigate(['/login']);
      return false;
    } catch (err) {
      console.error('Authentication check failed', err);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
