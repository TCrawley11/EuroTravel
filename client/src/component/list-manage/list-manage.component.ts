import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestinationList, SupabaseService } from '../../services/supabase.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-management',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule
  ],
  template: `
    <h2>My Lists</h2>
    @if (lists.length === 0) {
      <div>You haven't created any lists yet.</div>
    }
    @for (list of lists; track list.id) {
      <div>
        <h3>{{ list.name }}</h3>
        <p>{{ list.description }}</p>
        <span>{{ list.is_public ? 'Public' : 'Private' }}</span>
        
        <div>
          <button (click)="viewListDetails(list.id!)">View Details</button>
          <button (click)="editList(list.id!)">Edit</button>
          <button (click)="confirmDelete(list.id!)">Delete</button>
        </div>
      </div>
    }
  `
})
export class ListManagementComponent implements OnInit {
  lists: DestinationList[] = [];
  
  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const userId = await this.supabaseService.getCurrentUserId();
      if (!userId) {
        this.router.navigate(['/signin']);
        return;
      }
      const { data, error } = await this.supabaseService.getUserLists(userId);
      
      if (error) throw error;
      this.lists = data || [];
    } catch (err) {
      console.error('Error loading lists:', err);
    }
  }

  viewListDetails(listId: number) {
    this.router.navigate(['/list-details', listId]);
  }

  editList(listId: number) {
    this.router.navigate(['/list-edit', listId]);
  }

  async confirmDelete(listId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this list?' }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        try {
          const userId = await this.supabaseService.getCurrentUserId();
          if (!userId) return;
          
          const { error } = await this.supabaseService.deleteDestinationList(listId, userId);
          if (error) throw error;
          
          this.lists = this.lists.filter(list => list.id !== listId);
        } catch (err) {
          console.error('Error deleting list:', err);
        }
      }
    });
  }
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true">Confirm</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule // Add this
  ]
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}