import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-history',
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './patient-history.component.html',
  styleUrl: './patient-history.component.css'
})
export class PatientHistoryComponent {

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  oldAppointments: any[] = [];
  username: string = '';

  searchTerm: string = '';
  searchDate: string = '';
  searchAge: string = '';
  filteredAppointments: any[] = [];

  ngOnInit() {
    this.getOldAppointments();
    this.username = this.authService.getUserName()
  }

  getOldAppointments() {
    const userId = this.authService.getUserId();
    this.patientService.getOldAppointments(userId).subscribe({
      next: (res: any) => {
        this.oldAppointments = res.oldAppointments.sort((a: any, b: any) => {
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      });
      this.filteredAppointments = [...this.oldAppointments];
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

  onSearchChange() {
    const name = this.searchTerm.toLowerCase();
    const age = this.searchAge;
    const date = this.searchDate;

    this.filteredAppointments = this.oldAppointments.filter(appt =>
      (!name || appt.patientName.toLowerCase().includes(name) || appt.doctorName.toLowerCase().includes(name)) &&
      (!age || appt.patientAge.toString().includes(age)) &&
      (!date || appt.appointmentDate.includes(date))
    ).sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  }

  resetFilters() {
    this.searchTerm = '';
    this.searchAge = '';
    this.searchDate = '';
    this.filteredAppointments = [...this.oldAppointments]
  }
}
