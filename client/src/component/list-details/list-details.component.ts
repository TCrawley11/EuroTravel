import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationListWithDetails, SupabaseService, ListReview, Destination } from '../../services/supabase.service';
import { NgIf, NgFor } from '@angular/common';
import { ListReviewFormComponent } from "../list-review/list-review.component";
import { ListReviewDisplayComponent } from '../list-review-display/list-review-display.component';
@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [NgIf, NgFor, ListReviewFormComponent, ListReviewDisplayComponent],
  template: `
    @if (listDetails) {
      <h2>{{ listDetails.name }}</h2>
      <p>{{ listDetails.description }}</p>
      
      @for (destination of listDetails.destinations_details; track destination.id) {
        <div>
          <h3>{{ destination.Destination }}</h3>
          <p>{{ destination.Country }}, {{ destination.Region }}</p>
          
          <button (click)="showDestinationDetails(destination)">
            View Details
          </button>
        </div>
      }

      @if (canAddReview) {
    <section>
      <h3>Add a Review</h3>
      <app-list-review-form 
        [listId]="listDetails.id ?? null"
        (reviewSubmitted)="onReviewSubmitted($event)">
      </app-list-review-form>
    </section>
  }

  <section>
    <h3>Reviews</h3>
    <app-list-reviews-display
    [listId]="listDetails.id ?? null"> 
    </app-list-reviews-display>
  </section>
} @else {
  <p>Loading list details...</p>
}`
})
export class ListDetailsComponent implements OnInit {
  listDetails: DestinationListWithDetails | null = null;
  canAddReview: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const listId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(listId)) {
      console.error('Invalid list ID');
      return;
    }
    
    try {
      const userId = await this.supabaseService.getCurrentUserId();
      if (!userId) {
        console.error('User not logged in');
        return;
      }
  
      const { data, error } = await this.supabaseService.getListDetails(listId, userId);
      
      if (error) throw error;
      
      this.listDetails = data;
      this.canAddReview = await this.checkReviewEligibility();
    } catch (err) {
      console.error('Error loading list details:', err);
    }
  }

  async checkReviewEligibility(): Promise<boolean> {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) return false;
  
    // Optional: Check if user has already reviewed this list
    const { data: existingReviews } = await this.supabaseService.getListReviews(this.listDetails!.id!);
    const hasAlreadyReviewed = existingReviews?.some(review => review.user_id === userId);
  
    return !hasAlreadyReviewed;
  }

  showDestinationDetails(destination: Destination) {
    // Open destination details modal or navigate
    console.log('Show details for:', destination);
  }

  onReviewSubmitted(review: Partial<ListReview>) {
    // Handle review submission
    console.log('Review submitted:', review);
  }
}