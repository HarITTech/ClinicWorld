import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  resetPassword() {
    if (!this.password || !this.confirmPassword) {
      this.toastr.error('Please fill both fields', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      return;
    }

    this.loading = true;

    this.http.post(`http://localhost:4800/reset-password?token=${this.token}`, {
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success(res.message);
          this.password = '';
          this.confirmPassword = '';
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error.message || 'Something went wrong', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      }
    });
  }
}
