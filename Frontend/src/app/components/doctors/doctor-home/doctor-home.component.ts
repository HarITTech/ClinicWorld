import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-doctor-home',
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent {
todaysAppointmentCount: number = 0;
maxTokens: any;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private patientService: PatientService,
    private toastr: ToastrService
  ) { }

  doctorName: string = '';
  doctorId: string = '';
  getAllAppointments: any[] = [];
  filteredAppointments: any[] = [];

  showViewModal: boolean = false;
  userName: string = '';
  patientName: string = '';
  search: string = '';

  ngOnInit() {
    this.doctorName = this.authService.getDoctorName();
    this.doctorId = this.authService.getDoctorId();
    this.fetchAllAppointments();
    this.doctorService.getTodaysAppointments(this.doctorId).subscribe(res => {
      this.todaysAppointmentCount = res.numberOfTodaysAppointments
    });
    this.doctorService.getDoctorProfile(this.doctorId).subscribe(res => {
      this.maxTokens = res.myProfile.maxTokensPerDay
      console.log('res:', res)
    })
  }

  fetchAllAppointments() {
    this.doctorService.getTodaysAppointments(this.doctorId).subscribe((res: any) => {
      this.getAllAppointments = res.appointments;
      console.log('Check: ', res.numberOfTodaysAppointments);
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

  notCheck(appointmentId: string) {
    this.doctorService.updateAppointmentStatus(this.doctorId, appointmentId, 'notCheck').subscribe(() =>{
      this.toastr.warning('Status updated to not check!', '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      this.fetchAllAppointments();
    })
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
    this.showViewModal = false;
  }
}
