import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  loading: boolean = false; // loader state

  signup(){
    this.router.navigate(['/user-registration']);
  }

  forgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

  userInfo = {
    email: '',
    password: '',
    role: '',
  };

  password: boolean = false;

  togglePassword() {
    this.password = !this.password
  }

  async logIn(): Promise<void> {
    const { email, password, role } = this.userInfo;

    if (!email || !password || !role) {
      this.toastr.warning('Please fill all required fields', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      return;
    }

    this.loading = true;

    let doctorId: string | null = null;

    if (role === 'doctor') {
      doctorId = await this.loginService.getDoctorIdByEmail(email);
      if (!doctorId) {
        this.toastr.warning('Doctor not found for provided email', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        return;
      }
      localStorage.setItem('doctorId', doctorId);
    }

    this.loginService.login(role, this.userInfo).subscribe({
      next: (res) => {
        const { token, user } = res;

        if (role === 'patient') {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userId', user._id);
          localStorage.setItem('userName', user.fullName);
          this.router.navigate(['/patient-dashboard/home']);
          // console.log('User details:', user)
        } else if (role === 'doctor' && doctorId) {
          this.loginService.getDoctorDetailsById(doctorId).subscribe((res) => {
            if (res.success && res.doctorDetail === null) {
              this.router.navigate(['/doctor-additional-info']);
            } else {
              if (res.doctorDetail.status === 'pending') {
                this.router.navigate(['/doctor-status-pending']);
              } else if (res.doctorDetail.status === 'rejected') {
                this.router.navigate(['/doctor-status-rejected']);
              } else if (res.doctorDetail.status === 'inactive') {
                this.router.navigate(['/subscription']);
              } else {
                localStorage.setItem('doctorName', user.name);
                localStorage.setItem('authToken', token);
                this.router.navigate(['/doctor-dashboard/home']);
              }
            }
          });
        }
        this.loading = false;
        this.userInfo = { email: '', password: '', role: '' };
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Login failed', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        this.loading = false;
      }
    });
  }
}
