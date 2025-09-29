import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAdditionalInfoComponent } from './doctor-additional-info.component';

describe('DoctorAdditionalInfoComponent', () => {
  let component: DoctorAdditionalInfoComponent;
  let fixture: ComponentFixture<DoctorAdditionalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAdditionalInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
