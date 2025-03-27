import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReviewDisplayComponent } from './list-review-display.component';

describe('ListReviewDisplayComponent', () => {
  let component: ListReviewDisplayComponent;
  let fixture: ComponentFixture<ListReviewDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReviewDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReviewDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
