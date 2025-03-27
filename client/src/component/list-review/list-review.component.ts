import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-list-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="rating">
          Rating
        </label>
        <select formControlName="rating" id="rating" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="" disabled>Select a rating</option>
          <option *ngFor="let i of [1,2,3,4,5]" [value]="i">{{i}} star{{i > 1 ? 's' : ''}}</option>
        </select>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="comment">
          Comment
        </label>
        <textarea formControlName="comment" id="comment" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" [disabled]="!reviewForm.valid" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit Review
        </button>
      </div>
    </form>
  `
})
export class ListReviewFormComponent {
  @Input() listId: number | null = null;
  @Output() reviewSubmitted = new EventEmitter<{rating: number, comment: string}>();

  reviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.reviewForm.valid && this.listId !== null) {
      this.reviewSubmitted.emit({
        ...this.reviewForm.value,
        listId: this.listId
      });
      this.reviewForm.reset();
    }
  }
}