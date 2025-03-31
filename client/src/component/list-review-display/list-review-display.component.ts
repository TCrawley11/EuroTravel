import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SupabaseService, ListReview } from '../../services/supabase.service';

@Component({
  selector: 'app-list-reviews-display',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="reviews-container">
      @if (isLoading) {
        <p>Loading reviews...</p>
      } @else if (reviews.length === 0) {
        <p>No reviews yet.</p>
      } @else {
        @for (review of reviews; track review.id) {
          <div class="review-item">
            <div class="review-header">
              <span class="review-rating">Rating: {{ review.rating }} / 5</span>
              <span class="review-date">{{ review.created_at | date }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .reviews-container {
      margin-top: 20px;
    }
    .review-item {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .review-rating {
      font-weight: bold;
    }
    .review-date {
      color: #666;
    }
    .review-comment {
      line-height: 1.5;
    }
  `]
})
export class ListReviewDisplayComponent implements OnInit {
  @Input() listId: number | null = null;
  reviews: ListReview[] = [];
  isLoading = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadReviews();
  }

  async loadReviews() {
    this.isLoading = true;
    if (this.listId) {
      try {
      const { data, error } = await this.supabaseService.getListReviews(this.listId);
      if (error) throw error;
      this.reviews = data || [];
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      this.isLoading = false;
    }
    }
  }
}