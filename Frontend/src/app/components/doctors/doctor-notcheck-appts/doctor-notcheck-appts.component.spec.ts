import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorNotcheckApptsComponent } from './doctor-notcheck-appts.component';

describe('DoctorNotcheckApptsComponent', () => {
  let component: DoctorNotcheckApptsComponent;
  let fixture: ComponentFixture<DoctorNotcheckApptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorNotcheckApptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorNotcheckApptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
