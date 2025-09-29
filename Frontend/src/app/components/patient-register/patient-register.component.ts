import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  imports: [FormsModule, ToastrModule, CommonModule, NgxSpinnerModule],
  templateUrl: './patient-register.component.html',
  styleUrl: './patient-register.component.css'
})
export class UserRegisterComponent {
  constructor(
    private toastr: ToastrService,
    private patientService: PatientService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  password: boolean = false;
  c_password: boolean = false;

  togglePassword(field: string) {
    if (field === 'pass') {
      this.password = !this.password
    } else if (field === 'c_pass') {
      this.c_password = !this.c_password
    }
  }

  users: any = {
    "fullName": "",
    "mobile": "",
    "email": "",
    "password": "",
    "confirmPassword": "",
  }
  // http = inject(HttpClient)

  addUser() {
    this.spinner.show();
    this.patientService.registration(this.users).subscribe((res: any) => {
      this.users = {
        fullname: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      }
      this.toastr.success("User added successfully", '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      // after adding user, reset the form
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    },
      error => {
        this.spinner.hide(); // Hide loader after error
        // setTimeout(() => {
        //   this.spinner.hide(); // Hide loader
        // }, 5000);
        this.toastr.error(error.error.message, '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      })
  }
}
