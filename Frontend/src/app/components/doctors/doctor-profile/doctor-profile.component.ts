import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ChartData, ChartType } from 'chart.js';
import { AuthService } from '../../../services/auth.service';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule, ToastrModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private authService: AuthService,
    private doctorService: DoctorService
  ) { }


  profile: any = null;
  licenseCertificateUrl: SafeResourceUrl | null = null;
  degreeCertificateUrl: SafeResourceUrl | null = null;

  barChartType: ChartType = 'line';
  barChartData: ChartData<'line'> = { labels: [], datasets: [] };

  pieChartType: ChartType = 'doughnut';
  pieChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  doctorId: string = '';
  doctorName: string = '';
  isClinicOpen: boolean = false;

  loading: boolean = false;

  editForm: any = {
    name: '',
    phone: '',
    experience: 0,
    clinicAddress: {
      street: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India'
    },
    startTime: '',
    endTime: '',
    maxTokensPerDay: 0,
    workingDays: [],
    bio: '',
    profilePhoto: null,
    licenseCertificate: null,
    degreeCertificate: null,
    clinicPhotos: [],
    achievements: []
  };

  showPasswordModal: boolean = false;
  showEditModal: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';


  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;


  ngOnInit(): void {
    this.doctorId = this.authService.getDoctorId();
    this.doctorName = this.authService.getDoctorName();
    this.isClinicOpen = this.authService.isClinicOpen();
    this.fetchDoctorProfile();
    this.loadBarGraphData();
    this.loadPieChartData();
  }

  fetchDoctorProfile(): void {
    this.doctorService.getDoctorProfile(this.doctorId).subscribe({
      next: (res) => {
        this.profile = res.myProfile;
        this.populateEditForm();

        if (this.profile.licenseCertificate) {
          this.licenseCertificateUrl = this.profile.licenseCertificate;
        }

        if (this.profile.degreeCertificate) {
          this.degreeCertificateUrl = this.profile.degreeCertificate;
        }
      },
      error: (err) => console.error('Error loading profile', err)
    });
  }


  loadBarGraphData(): void {
    this.doctorService.getBarChartData(this.doctorId).subscribe(res => {
      const counts: { [date: string]: { completed: number, notCheck: number } } = {};
      res.barGraphData.forEach((entry: any) => {
        const d = entry.appointmentDate;
        if (!counts[d]) counts[d] = { completed: 0, notCheck: 0 };
        if (entry.patientStatus === 'completed') counts[d].completed += 1;
        if (entry.patientStatus === 'notCheck') counts[d].notCheck += 1;
      });

      const sortedDates = Object.keys(counts).sort();
      this.barChartData = {
        labels: sortedDates,
        datasets: [
          {
            data: sortedDates.map(date => counts[date].completed),
            label: 'Completed',
            borderColor: '#25b7c0',
            backgroundColor: 'rgba(37, 183, 192, 0.10)',
            pointBackgroundColor: '#25b7c0',
            fill: false
          },
          {
            data: sortedDates.map(date => counts[date].notCheck),
            label: 'Not Checked',
            borderColor: '#117b87',
            backgroundColor: 'rgba(17, 123, 135, 0.15)',
            pointBackgroundColor: '#117b87',
            fill: false,
            borderWidth: 3
          }
        ]
      };
    });
  }

  loadPieChartData(): void {
    this.doctorService.getPieChartData(this.doctorId).subscribe(res => {
      const counts = { completed: 0, notCheck: 0 };
      res.barGraphData.forEach((item: any) => {
        if (item.patientStatus === 'completed') counts.completed++;
        if (item.patientStatus === 'notCheck') counts.notCheck++;
      });
      const total = counts.completed + counts.notCheck;
      const percent = total === 0 ? [0, 0] : [
        Math.round((counts.completed / total) * 100),
        Math.round((counts.notCheck / total) * 100)
      ];
      this.pieChartData = {
        labels: [
          'Completed (' + percent[0] + '%)',
          'Not Checked (' + percent[1] + '%)'
        ],
        datasets: [{
          data: percent,
          backgroundColor: ['#25b7c0', '#117b87'],
          borderWidth: 1
        }]
      };
    });
  }

  onWorkingDaysChange(value: string): void {
    this.editForm.workingDays = value.split(',').map(day => day.trim()).filter(day => day !== '');
  }

  populateEditForm(): void {
    if (!this.profile) return;
    this.editForm = {
      name: this.profile.name,
      phone: this.profile.phone,
      experience: this.profile.experience,
      // clinicAddress: {
      street: this.profile.clinicAddress.street,
      city: this.profile.clinicAddress.city,
      state: this.profile.clinicAddress.state,
      pinCode: this.profile.clinicAddress.pinCode,
      country: this.profile.clinicAddress.country,
      // },
      startTime: this.profile.startTime,
      endTime: this.profile.endTime,
      workingDays: this.profile.workingDays,
      clinicLocationURL: this.profile.clinicLocationURL,
      maxTokensPerDay: this.profile.maxTokensPerDay,
      bio: this.profile.bio,
      profilePhoto: null,
      licenseCertificate: null,
      degreeCertificate: null,
      clinicPhotos: [],
      achievements: []
    };
  }

  onFileChange(event: any, field: string): void {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;
    if (!fileList || fileList.length === 0) return;

    if (field === 'clinicPhotos' || field === 'achievements') {
      this.editForm[field] = Array.from(fileList);
    } else {
      this.editForm[field] = fileList[0];
    }
  }

  // getImageUrl(path: string): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:4800/${path.replace(/\\/g, '/')}`);
  // }

  getImageUrl(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  submitForm(): void {
    const formData = new FormData();
    formData.append('name', this.editForm.name);
    formData.append('phone', this.editForm.phone);
    formData.append('experience', this.editForm.experience.toString());
    formData.append('street', this.editForm.street);
    formData.append('city', this.editForm.city);
    formData.append('state', this.editForm.state);
    formData.append('pinCode', this.editForm.pinCode);
    formData.append('country', this.editForm.country);
    formData.append('startTime', this.editForm.startTime);
    formData.append('endTime', this.editForm.endTime);
    formData.append('bio', this.editForm.bio);
    formData.append('clinicLocationURL', this.editForm.clinicLocationURL);
    formData.append('maxTokensPerDay', this.editForm.maxTokensPerDay.toString());

    this.editForm.workingDays.forEach((day: string, index: number) => {
      formData.append(`workingDays[${index}]`, day);
    });

    if (this.editForm.profilePhoto) {
      formData.append('profilePhoto', this.editForm.profilePhoto);
    }
    if (this.editForm.licenseCertificate) {
      formData.append('licenseCertificate', this.editForm.licenseCertificate);
    }
    if (this.editForm.degreeCertificate) {
      formData.append('degreeCertificate', this.editForm.degreeCertificate);
    }

    for (let file of this.editForm.clinicPhotos) {
      formData.append('clinicPhotos', file);
    }
    for (let file of this.editForm.achievements) {
      formData.append('achievements', file);
    }

    this.loading = true;

    this.doctorService.updateDoctorProfile(this.doctorId, formData).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        this.fetchDoctorProfile();
        const modalElement = document.getElementById('editProfileModal');
        if (modalElement) {
          const modalInstance = (window as any).bootstrap?.Modal.getInstance(modalElement)
            || new (window as any).bootstrap.Modal(modalElement);
          modalInstance.hide();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Update failed', err);
        this.toastr.error('Failed to update profile', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        this.loading = false;
      }
    });
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

  changePass(doctorId: string) {
    this.showPasswordModal = true;
    this.doctorId = doctorId;
  }

  change() {
    const doctorId = this.authService.getDoctorId();
    const changeData = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }

    this.loading = true;

    this.doctorService.changePassword(doctorId, changeData).subscribe({
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
        this.loading = false;
      },
      error: (err) => {
        const message = err.error?.msg || "Something went wrong";
        this.toastr.error(message, '', {
          positionClass: 'toast-top-right',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        this.loading = false;
      }
    })
  }

  closeModal() {
    this.showEditModal = false;
    this.showPasswordModal = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
