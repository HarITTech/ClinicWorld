import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './patient-appointments.component.html',
  styleUrl: './patient-appointments.component.css'
})
export class PatientAppointmentsComponent {
  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  appointments: any[] = [];
  userId: any = null;
  username: string = '';

  patientName: string = '';
  patientAge: string = '';
  patientProblem: string = '';

  showModal: boolean = false;
  showDeleteModal: boolean = false;

  doctorId: string = '';
  appointmentId: string = '';

  deleteDoctorId: string = '';
  deleteAppointmentId: string = '';

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUserName();
    if (this.userId) {
      this.fetchAppointments();
    } else {
      this.toastr.error("No userId found in localStorage", '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
    }
  }

  fetchAppointments() {
    this.patientService.getMyAppointments(this.userId).subscribe((res: any) => {
      if (res.success) {
        this.appointments = res.userAppointments;
      } else {
        console.error("Failed to fetch appointments:", res.message);
      }
    });
  }

  // ------------------ EDIT ------------------
  updateAppointment(doctorId: string, appointmentId: string) {
    this.doctorId = doctorId;
    this.appointmentId = appointmentId;

    const selected = this.appointments.find(appt => appt.appt._id === appointmentId);
    if (selected) {
      this.patientName = selected.appt.patientName;
      this.patientAge = selected.appt.patientAge;
      this.patientProblem = selected.appt.patientProblem;
    }
    this.showModal = true;
  }

  submitAppointmentUpdate() {
    const updateData = {
      patientName: this.patientName,
      patientAge: this.patientAge,
      patientProblem: this.patientProblem
    };

    this.patientService.editAppointment(this.doctorId, this.appointmentId, updateData)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Appointment updated successfully!', '', {
            positionClass: 'toast-top-center',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
          this.fetchAppointments();
          this.closeModal();
        } else {
          this.toastr.error(res.message || 'Failed to update appointment', '', {
            positionClass: 'toast-top-center',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
        }
      }, error => {
        console.error("Error updating appointment:", error);
        this.toastr.error("Error occurred while updating appointment", '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      });
  }

  closeModal() {
    this.showModal = false;
    this.patientName = '';
    this.patientAge = '';
    this.patientProblem = '';
    this.doctorId = '';
    this.appointmentId = '';
  }

  // ------------------ DELETE ------------------
  openDeleteModal(doctorId: string, appointmentId: string) {
    this.deleteDoctorId = doctorId;
    this.deleteAppointmentId = appointmentId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteDoctorId = '';
    this.deleteAppointmentId = '';
  }

  deleteAppointment() {
    this.patientService.cancelAppointment(this.deleteDoctorId, this.deleteAppointmentId)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Appointment deleted successfully!', '', {
            positionClass: 'toast-top-center',
            toastClass: 'ngx-toastr animate__animated animate__fadeIn',
            timeOut: 2000,
          });
          this.fetchAppointments();
          this.closeDeleteModal();
        } else {
          this.toastr.error('Failed to delete appointment', '', {
            positionClass: 'toast-top-center',
            timeOut: 2000,
          });
        }
      }, error => {
        console.error("Delete error:", error);
        this.toastr.error('Error deleting appointment', '', {
          positionClass: 'toast-top-center',
          timeOut: 2000,
        });
      });
  }
}
