import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorStatusRejectedComponent } from './doctor-status-rejected.component';

describe('DoctorStatusRejectedComponent', () => {
  let component: DoctorStatusRejectedComponent;
  let fixture: ComponentFixture<DoctorStatusRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorStatusRejectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorStatusRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
