import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-doctor-additional-info',
  imports: [CommonModule, FormsModule, ToastrModule, NgxSpinnerModule],
  templateUrl: './doctor-additional-info.component.html',
  styleUrl: './doctor-additional-info.component.css'
})
export class DoctorAdditionalInfoComponent {
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private doctorService: DoctorService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  doctorId = localStorage.getItem('doctorId');

  doctorInfo: any = {
    profilePhoto: null,
    degreeCertificate: null,
    licenseCertificate: null,
    registrationNumber: '',
    experience: '',
    bio: '',
    clinicAddress: {
      street: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India'
    },
    clinicLocationURL: '',
    achievements: [],
    clinicPhotos: []
  };

  // Handle single file fields
  onSingleFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.doctorInfo[field] = input.files[0];
    }
  }

  // Handle multiple file fields
  onMultipleFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.doctorInfo[field] = Array.from(input.files);
    }
  }

  submit(): void {
    this.spinner.show();
    // Append each field properly
    const formData = new FormData();

    // Append single file fields
    if (this.doctorInfo.profilePhoto) {
      formData.append('profilePhoto', this.doctorInfo.profilePhoto);
    }
    if (this.doctorInfo.degreeCertificate) {
      formData.append('degreeCertificate', this.doctorInfo.degreeCertificate);
    }
    if (this.doctorInfo.licenseCertificate) {
      formData.append('licenseCertificate', this.doctorInfo.licenseCertificate);
    }

    // Append simple text fields
    formData.append('registrationNumber', this.doctorInfo.registrationNumber);
    formData.append('experience', this.doctorInfo.experience);
    formData.append('bio', this.doctorInfo.bio);
    formData.append('clinicLocationURL', this.doctorInfo.clinicLocationURL);

    // Append nested clinicAddress fields with bracket notation
    formData.append('clinicAddress[street]', this.doctorInfo.clinicAddress.street);
    formData.append('clinicAddress[city]', this.doctorInfo.clinicAddress.city);
    formData.append('clinicAddress[state]', this.doctorInfo.clinicAddress.state);
    formData.append('clinicAddress[pinCode]', this.doctorInfo.clinicAddress.pinCode);
    formData.append('clinicAddress[country]', this.doctorInfo.clinicAddress.country);

    // Append multiple file fields
    if (this.doctorInfo.achievements?.length) {
      this.doctorInfo.achievements.forEach((file: File) => {
        formData.append('achievements', file);
      });
    }
    if (this.doctorInfo.clinicPhotos?.length) {
      this.doctorInfo.clinicPhotos.forEach((file: File) => {
        formData.append('clinicPhotos', file);
      });
    }

    this.doctorService.additionalInfo(this.doctorId, formData).subscribe({
      next: () => {
        this.toastr.success('Doctor added successfully', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });

        // Reset the form
        this.doctorInfo = {
          profilePhoto: null,
          degreeCertificate: null,
          licenseCertificate: null,
          registrationNumber: '',
          experience: '',
          bio: '',
          clinicAddress: {
            street: '',
            city: '',
            state: '',
            pinCode: '',
            country: 'India'
          },
          clinicLocationURL: '',
          achievements: [],
          clinicPhotos: []
        };
        setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message || 'Something went wrong', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000
        });
      }
    });
  }
}
