import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [RouterModule, CommonModule, ToastrModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent {

  constructor(
    public router: Router,
    private doctorService: DoctorService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  username: string = '';
  doctorId: string = '';
  isClinicOpen: boolean = false;
  isCollapsed = true;

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeNavbar() {
    this.isCollapsed = true;
  }

  ngOnInit() {
    this.username = this.authService.getDoctorName();
    this.doctorId = this.authService.getDoctorId();
    this.fetchClinicStatus();
  }

  fetchClinicStatus() {
    this.isClinicOpen = this.authService.isClinicOpen();

    this.doctorService.getDoctorProfile(this.doctorId).subscribe({
      next: (res) => {
        if (res?.doctor?.isClinicOpen !== undefined) {
          this.isClinicOpen = res.doctor.isClinicOpen;
          this.authService.setClinicOpen(this.isClinicOpen);
        }
      },
      error: () => {
        console.error('Error fetching clinic status, using localStorage fallback.');
      }
    });
  }

  toggleClinicStatus() {
    this.doctorService.toggleClinicStatus(this.doctorId).subscribe({
      next: (res) => {
        this.isClinicOpen = !this.isClinicOpen;
        this.authService.setClinicOpen(this.isClinicOpen); // Save in localStorage
        this.toastr.success(res.message, '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__fadeInDown',
          timeOut: 2000
        })
      },
      error: () => {
        this.toastr.error('Failed to toggle clinic status', '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__fadeInDown',
          timeOut: 2000
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '';
  }
}
