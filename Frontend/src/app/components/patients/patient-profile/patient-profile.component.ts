import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-profile',
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent {

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  username: any;
  userId: any;
  fullName: any;
  email: any = null;
  mobile: any;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  showEditModal: boolean = false;
  showPasswordModal: boolean = false;

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  fetchUserProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService.getUserProfile(userId).subscribe((res: any) => {
        if (res && res.User) {
          this.fullName = res.User.fullName,
            this.mobile = res.User.mobile,
            this.email = res.User.email
        }
        else {
          this.toastr.error('User profile not found', '', {
            positionClass: 'toast-top-right',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
        }
      })
    }
  }
  ngOnInit() {
    this.username = localStorage.getItem('userName') || 'Username not found';
    this.fetchUserProfile();
  }

  editProfile(userId: any) {
    this.showEditModal = true;
    this.userId = userId;
    this.fetchUserProfile();
  }

  updateProfile() {
    const userId = this.authService.getUserId();
    const updateData = {
      fullName: this.fullName,
      mobile: this.mobile,
      email: this.email,
    }

    this.patientService.updateProfile(userId, updateData).subscribe((res: any) => {
      if (res && res.success) {
        this.toastr.success('Profile updated successfully', '', {
          positionClass: 'toast-top-right',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        this.showEditModal = false;
        const userName = this.authService.setUserName(this.fullName);
        this.fetchUserProfile();
      } else {
        this.toastr.error('Failed to update profile', '', {
          positionClass: 'toast-top-right',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      }
    })
  }

  changePass(userId: any) {
    this.showPasswordModal = true;
    this.userId = userId;
    this.fetchUserProfile();
  }

  change() {
    const userId = this.authService.getUserId();
    const changeData = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }

    this.patientService.changePassword(userId, changeData).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toastr.success(res.msg || 'Password changed successfully', '', {
            positionClass: 'toast-top-right',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
          this.showPasswordModal = false;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        }
      },
      error: (err) => {
        const message = err.error?.msg || "Something went wrong";
        this.toastr.error(message, '', {
          positionClass: 'toast-top-right',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      }
    });
  }

  closeModal() {
    this.showEditModal = false;
    this.showPasswordModal = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  togglePassword(field: string) {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
