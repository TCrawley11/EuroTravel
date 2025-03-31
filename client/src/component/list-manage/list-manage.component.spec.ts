import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManagementComponent } from './list-manage.component';

describe('ListManageComponent', () => {
  let component: ListManagementComponent;
  let fixture: ComponentFixture<ListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
