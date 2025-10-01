import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../services/doctor.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-register',
  imports: [FormsModule, CommonModule, ToastrModule, NgxSpinnerModule],
  templateUrl: './doctor-register.component.html',
  styleUrl: './doctor-register.component.css'
})
export class DoctorRegisterComponent {

  constructor(
    private toastr: ToastrService,
    private doctorService: DoctorService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  doctor: any = {
    'name': "",
    'email': "",
    'phone': "",
    'specialization': "",
    workingDays: [] as string[],
    'startTime': "",
    'endTime': "",
    maxTokensPerDay: "",
  }
  signin(){
    this.router.navigate(['/login']);
  }

  onDayChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  if (input.checked) {
    // Add if checked
    if (!this.doctor.workingDays.includes(value)) {
      this.doctor.workingDays.push(value);
    }
  } else {
    // Remove if unchecked
    this.doctor.workingDays = this.doctor.workingDays.filter((day: string) => day !== value);
  }
}

  register() {
    this.spinner.show()
    this.doctorService.registration(this.doctor).subscribe((res: any) => {
      this.doctor = {
        name: "",
        email: "",
        phone: "",
        specialization: "",
        workingDays: "",
        startTime: "",
        endTime: "",
        maxTokensPerDay: "",
      }

      this.toastr.success('Your account has been created successfully. Login credentials have been emailed to your registered address.', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 10000
      })

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    },
      error => {
        this.spinner.hide()
        this.toastr.error(error.error.message, 'somthing went wrong', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      })
  }
}
