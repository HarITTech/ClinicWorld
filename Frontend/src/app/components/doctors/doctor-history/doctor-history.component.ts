import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-history',
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor-history.component.html',
  styleUrl: './doctor-history.component.css'
})
export class DoctorHistoryComponent {
  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) { }

  oldCompletedAppointments: any[] = [];
  oldNotCheckedAppointments: any[] = [];
  filteredCompleted: any[] = [];
  filteredNotChecked: any[] = [];

  searchTerm: string = '';
  searchDate: string = '';
  searchAge: string = '';

  doctorId: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number[] = [];

  ngOnInit() {
    this.doctorId = this.authService.getDoctorId();
    this.getOldCompletedAppointments();
    this.getOldNotCheckedAppointments();
  }

  getOldCompletedAppointments() {
    this.doctorService.getOldCompletedAppointments(this.doctorId).subscribe(res => {
      this.oldCompletedAppointments = res.oldAppointments.sort((a: any, b: any)=>{
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      });
      this.filteredCompleted = [...this.oldCompletedAppointments];
      this.updatePagination();
    })
  }

  getOldNotCheckedAppointments() {
    this.doctorService.getOldNotCheckedAppointments(this.doctorId).subscribe(res => {
      this.oldNotCheckedAppointments = res.oldAppointments.sort((a: any, b: any)=>{
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      })
      this.filteredNotChecked = [...this.oldNotCheckedAppointments];
      this.updatePagination();
    })
  }

  onSearchChange() {
    const name = this.searchTerm.toLowerCase();
    const age = this.searchAge;
    const date = this.searchDate;

    this.filteredCompleted = this.oldCompletedAppointments.filter(appt =>
      (!name || appt.patientName.toLowerCase().includes(name)) &&
      (!age || appt.patientAge.toString().includes(age)) &&
      (!date || appt.appointmentDate.includes(date))
    ).sort((a: any, b: any)=>{
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      });

    this.filteredNotChecked = this.oldNotCheckedAppointments.filter(appt =>
      (!name || appt.patientName.toLowerCase().includes(name)) &&
      (!age || appt.patientAge.toString().includes(age)) &&
      (!date || appt.appointmentDate.includes(date))
    ).sort((a: any, b: any)=>{
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters() {
    this.searchTerm = '';
    this.searchAge = '';
    this.searchDate = '';
    this.filteredCompleted = [...this.oldCompletedAppointments];
    this.filteredNotChecked = [...this.oldNotCheckedAppointments];
    this.updatePagination();
  }

  get totalPagesCount(): number {
    return Math.ceil(this.filteredCompleted.length / this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = Array.from({ length: this.totalPagesCount }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPagesCount) return;
    this.currentPage = page;
  }

  filteredCompletedAppointments() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompleted.slice(start, start + this.itemsPerPage);
  }

  filteredNotCheckedAppointments() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredNotChecked.slice(start, start + this.itemsPerPage);
  }
}
