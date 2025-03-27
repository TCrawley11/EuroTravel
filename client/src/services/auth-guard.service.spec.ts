import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth-guard.service';
import { SupabaseService } from './supabase.service';  // Assuming you're using SupabaseService for auth
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let supabaseServiceMock: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    // Create a mock for SupabaseService
    const spy = jasmine.createSpyObj('SupabaseService', ['getCurrentUserId']);

    TestBed.configureTestingModule({
      imports: [Router],
      providers: [
        AuthGuard,
        { provide: SupabaseService, useValue: spy }
      ]
    });

    TestBed.runInInjectionContext(() => {
      guard = TestBed.inject(AuthGuard);
    supabaseServiceMock = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
    })
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});