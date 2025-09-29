import { Component } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, ToastrModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  constructor (
    private doctorService: DoctorService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';


  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePassword(field: string) {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  change() {
    const doctorId = this.authService.getDoctorId();
    const changeData = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }

    this.doctorService.changePassword(doctorId, changeData).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toastr.success(res.msg || 'Password changed successfully', '', {
            positionClass: 'toast-top-center',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        }
      },
      error: (err) => {
        const message = err.error?.msg || "Something went wrong";
        this.toastr.error(message, '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      }
    })
  }
}
