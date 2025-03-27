import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReviewFormComponent } from './list-review.component';

describe('ListReviewComponent', () => {
  let component: ListReviewFormComponent;
  let fixture: ComponentFixture<ListReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
