import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService, DestinationList, Destination } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-list-create',
  standalone: true,
  imports: [ReactiveFormsModule, SearchComponent,],
  template: `
    <form [formGroup]="listForm" (ngSubmit)="createList()">
      <div>
        <label>List Name:</label>
        <input formControlName="name" placeholder="List Name" required>
        @if (listForm.get('name')?.invalid && listForm.get('name')?.touched) {
          @if (listForm.get('name')?.hasError('required')) {
            <small>Name is required </small>
          }
          @if (listForm.get('name')?.hasError('maxLength')) {
            <small>Name is too long </small>
          }
        }
      </div>
      
      <div>
        <label>Description (Optional):</label>
        <textarea formControlName="description" placeholder="Optional Description"></textarea>
      </div>
      
      <h3>Add Destinations</h3>
      <div formArrayName="destinations" class="destination-field">
        @for (dest of destinationsArray.controls; track dest) {
          <div>
          <app-destination-search 
          (destinationSelected)="onDestinationSelect($event, $index)" >
          </app-destination-search>
          <button type="button" (click)="removeDestination($index)">Remove</button>
        </div>
        }          
      </div>
      <button type="button" (click)="addDestinationField()">Add Destination</button>
      
      <div>
        <label>
          <input type="checkbox" formControlName="is_public">
          Make List Public
        </label>
      </div>
      
      <button type="submit" [disabled]="listForm.invalid">Create List</button>
    </form>
    @if (errorMessage) {
      <div class="error-message">
      {{ errorMessage }}
    </div>
    }
  `,
  styles: [`
    .destination-field {
      margin-bottom: 10px;
    }
    .error-message {
      color: red;
      margin-top: 10px;
    }
    button {
      margin: 5px 0;
    }
  `]
})
export class ListCreateComponent implements OnInit {
  listForm!: FormGroup; // Removed `| undefined`
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder, 
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      destinations: this.fb.array([]),
      is_public: [false]
    });
  }

  get destinationsArray(): FormArray {
    return this.listForm.get('destinations') as FormArray;
  }

  addDestinationField() {
    this.destinationsArray.push(this.fb.control('', Validators.required));
  }

  removeDestination(index: number) {
    this.destinationsArray.removeAt(index);
  }

  onDestinationSelect(destination: Destination, index: number) {
    this.destinationsArray.at(index).setValue(destination.Destination); 
  }

  async createList() {
    if (this.listForm.valid) {
      try {
        const userId = await this.supabaseService.getCurrentUserId();
        if (!userId) {
          this.errorMessage = 'User not logged in.';
          return;
        }
        const listData: Partial<DestinationList> = {
          ...this.listForm.value,
          user_id: userId
        };

        const { data, error } = await this.supabaseService.createDestinationList(listData);
        if (error) {
          this.errorMessage = error.message;
        } else {
          this.router.navigate(['/lists']);
        }
      } catch (error) {
        this.errorMessage = 'An unexpected error occurred.';
        console.error(error);
      }
    }
  }
}
