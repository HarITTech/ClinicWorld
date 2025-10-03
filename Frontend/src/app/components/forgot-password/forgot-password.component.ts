import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';
  loading: boolean = false; // loader state

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private forgotPassword: ForgotPasswordService
  ) {}

  submit() {
    if (!this.email) {
      this.toastr.error('Please enter email', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      return;
    }

    this.loading = true;

    this.forgotPassword.forgotPassword(this.email).subscribe({
    // this.http.post<any>('https://clinic-world.onrender.com/forgot-password', { email: this.email }).subscribe({
        next: (res) => {
          if (res.success) {
            this.message = res.message;
            this.error = '';
            this.toastr.success("Mail sent successfully", '', {
              positionClass: 'toast-top-center',
              toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
              timeOut: 2000,
            });
            this.email = '';
          } else {
            this.error = res.message;
            this.message = '';
            this.toastr.error(res.message, '', {
              positionClass: 'toast-top-center',
              toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
              timeOut: 2000,
            });
          }
          this.loading = false;
        },
        error: (err) => {
          this.message = '';
          this.toastr.error(err?.error?.message || 'Failed to send email', '', {
            positionClass: 'toast-top-center',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
          this.loading = false;
        }
      });
  }
}
