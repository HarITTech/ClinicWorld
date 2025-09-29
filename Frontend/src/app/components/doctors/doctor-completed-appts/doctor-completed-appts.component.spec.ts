import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCompletedApptsComponent } from './doctor-completed-appts.component';

describe('DoctorCompletedApptsComponent', () => {
  let component: DoctorCompletedApptsComponent;
  let fixture: ComponentFixture<DoctorCompletedApptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCompletedApptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCompletedApptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
