import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../../services/doctor.service';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-notcheck-appts',
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './doctor-notcheck-appts.component.html',
  styleUrl: './doctor-notcheck-appts.component.css'
})
export class DoctorNotcheckApptsComponent {

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  doctorName: string = '';
  doctorId: string = '';
  getAllAppointments: any[] = [];
  users: any[] = [];
  appointments: any[] = [];
  showViewModal: boolean = false;

  userName: String = "";
  patientName: String = "";

  search: string = '';
  filteredAppointments: any[] = [];

  ngOnInit() {
    this.doctorName = this.authService.getDoctorName();
    this.doctorId = this.authService.getDoctorId();
    this.fetchAllAppointments();
  }

  fetchAllAppointments() {
    this.doctorService.getNotCheckedAppointments(this.doctorId).subscribe((res: any) => {
      this.getAllAppointments = res.NotCheckAppointments;
      this.filteredAppointments = [...this.getAllAppointments];
    });
  }

  onSearchChange() {
    const searchTerm = this.search.toLowerCase();
    this.filteredAppointments = this.getAllAppointments.filter(appt =>
      appt.patientName?.toLowerCase().includes(searchTerm) ||
      appt.patientAge?.toString().includes(searchTerm) ||
      appt.patientProblem?.toLowerCase().includes(searchTerm) ||
      appt.appointmentNumber?.toString().includes(searchTerm)
    );
  }

  completed(appointmentId: string) {
    this.doctorService.updateAppointmentStatus(this.doctorId, appointmentId, 'completed').subscribe(()=>{
      this.toastr.success('Status updated to completed!', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      this.fetchAllAppointments();
    });
  }

  view(userId: string, appointmentId: string) {
    this.showViewModal = true;

    this.patientService.getUserProfile(userId).subscribe(res => {
      this.userName = res.User.fullName;
    });

    this.doctorService.getPatientAppointment(this.doctorId, appointmentId).subscribe(res => {
      this.patientName = res.appointment.patientName;
    });
  }

  closeModal() {
    this.showViewModal = false
  }
}
