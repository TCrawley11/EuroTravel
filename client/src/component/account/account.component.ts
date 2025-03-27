import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { SupabaseService, Profile } from '../../services/supabase.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  imports: [ReactiveFormsModule]
})
export class AccountComponent implements OnInit {
  loading = false
  profile!: Profile
  updateProfileForm!: FormGroup;

  @Input()
  session!: AuthSession

  constructor(
    private readonly supabase: SupabaseService,
    private formBuilder: FormBuilder
  ) {
    const updateProfileForm = this.formBuilder.group({
      username: '',
      website: '',
      avatar_url: '',
    })
  }

  async ngOnInit(): Promise<void> {
    await this.getProfile()

    const {avatar_url } = this.profile
    this.updateProfileForm.patchValue({
      avatar_url,
    })
  }

  async getProfile() {
    try {
      this.loading = true
      const { user } = this.session
      const { data: profile, error, status } = await this.supabase.profile(user)

      if (error && status !== 406) {
        throw error
      }

      if (profile) {
        this.profile = profile
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const { user } = this.session

      const avatar_url = this.updateProfileForm.value.avatar_url as string

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        avatar_url,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async signOut() {
    await this.supabase.signOut()
  }
}
