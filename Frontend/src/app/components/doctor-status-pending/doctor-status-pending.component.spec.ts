import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorStatusPendingComponent } from './doctor-status-pending.component';

describe('DoctorStatusPendingComponent', () => {
  let component: DoctorStatusPendingComponent;
  let fixture: ComponentFixture<DoctorStatusPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorStatusPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorStatusPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
