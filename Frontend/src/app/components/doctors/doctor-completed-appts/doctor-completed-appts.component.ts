import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-completed-appts',
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor-completed-appts.component.html',
  styleUrl: './doctor-completed-appts.component.css'
})
export class DoctorCompletedApptsComponent {

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private authService: AuthService
  ) { }

  doctorName: string = '';
  doctorId: string = '';
  getAllCompleteAppointments: any[] = [];

  showViewModal: boolean = false;
  userName: String = "";
  userPhone: String = "";
  userEmail: String = "";
  patientName: String = "";
  patientAge: String = "";

  search: string = '';
  filteredAppointments: any[] = [];

  ngOnInit() {
    this.doctorName = this.authService.getDoctorName();
    this.doctorId = this.authService.getDoctorId();
    this.fetchAllCompleteAppts();
  }

  fetchAllCompleteAppts(){
    this.doctorService.getCompletedAppointments(this.doctorId).subscribe(res => {
      this.getAllCompleteAppointments = res.completedAppointments;
      this.filteredAppointments = [...this.getAllCompleteAppointments]
    })
  }

    onSearchChange() {
    const searchTerm = this.search.toLowerCase();
    this.filteredAppointments = this.getAllCompleteAppointments.filter(appt =>
      appt.patientName?.toLowerCase().includes(searchTerm) ||
      appt.patientAge?.toString().includes(searchTerm) ||
      appt.patientProblem?.toLowerCase().includes(searchTerm) ||
      appt.appointmentNumber?.toString().includes(searchTerm)
    );
  }

    view(userId: string, appointmentId: string){
    this.showViewModal = true;

    this.patientService.getUserProfile(userId).subscribe(res => {
      this.userName = res.User.fullName;
      this.userPhone = res.User.mobile;
      this.userEmail = res.User.email;
    })

    this.doctorService.getPatientAppointment(this.doctorId, appointmentId).subscribe(res => {
      this.patientName = res.appointment.patientName;
      this.patientAge = res.appointment.patientAge;
    });
  }

  closeModal(){
    this.showViewModal = false
  }
}
