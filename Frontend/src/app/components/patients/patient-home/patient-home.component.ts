import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';
import { DoctorService } from '../../../services/doctor.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-home',
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './patient-home.component.html',
  styleUrl: './patient-home.component.css'
})
export class PatientHomeComponent {

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private doctorService: DoctorService,
    private toastr: ToastrService,
  ) { }

  isSidebarCollapsed = false;
  favoriteDoctorIds: string[] = [];

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  username: string = '';
  getAllDoctors: any[] = [];
  isDisable: boolean = false;

  showModal: boolean = false;
  selectedDoctor: any = null;

  patientName: string = '';
  patientAge: number | null = null;
  patientProblem: string = '';

  search: string = '';
  filteredAppointments: any[] = [];

  // Feedback Modal
  showFeedbackModal: boolean = false;
  feedbackRating: number = 5;
  feedbackComment: string = '';
  feedbackDoctorId: string = '';

  // Doctor Profile Modal
  showProfileModal: boolean = false;
  myProfile: any = null;
  todaysAppt: any[] = [];

  // ✅ Fetch both: favorites & doctors, then reorder
  fetchFavoritesAndDoctors() {
    const userId = this.authService.getUserId();

    // Get patient's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Step 1: Get favorite doctor IDs
        this.patientService.getFavoriteDoctors(userId).subscribe(favRes => {
          this.favoriteDoctorIds = favRes.doctors.map((doc: any) => doc._id);

          // Step 2: Fetch doctors with location
          this.doctorService.getAllDoctors(lat, lng).subscribe(docRes => {
            const allDoctors = docRes.data;

            // Step 3: Sort favorites first
            this.getAllDoctors = [
              ...allDoctors.filter((doc: any) => this.favoriteDoctorIds.includes(doc.doctor._id)),
              ...allDoctors.filter((doc: any) => !this.favoriteDoctorIds.includes(doc.doctor._id)),
            ];

            this.filteredAppointments = [...this.getAllDoctors];

            this.getAllDoctors.forEach((doc: any) => {
              const docId = doc.doctor._id;
              this.doctorService.getTodaysAppointments(docId).subscribe((res: any) => {
                doc.todayAppointmentCount = res.numberOfTodaysAppointments;
              });
            });
          });
        });
      },
      (error) => {
        console.error("Error getting location", error);
        // Fallback: call without location
        this.patientService.getFavoriteDoctors(userId).subscribe(favRes => {
          this.favoriteDoctorIds = favRes.doctors.map((doc: any) => doc._id);
          this.doctorService.getAllDoctors().subscribe(docRes => {
            const allDoctors = docRes.data;
            this.getAllDoctors = [
              ...allDoctors.filter((doc: any) => this.favoriteDoctorIds.includes(doc.doctor._id)),
              ...allDoctors.filter((doc: any) => !this.favoriteDoctorIds.includes(doc.doctor._id)),
            ];
            this.filteredAppointments = [...this.getAllDoctors];
          });
        });
      }
    );
  }


  getStarRatings(avgRating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }

  onSearchChange() {
    const searchData = this.search.toLowerCase();
    this.filteredAppointments = this.getAllDoctors.filter(doctor =>
      doctor.doctor.specialization.toLowerCase().includes(searchData) ||
      doctor.doctor.name.toLowerCase().includes(searchData) ||
      doctor.details.experience.toString().includes(searchData) ||
      doctor.doctor.averageRating.toString().includes(searchData)
    )
  }

  getCurrentAppointmentNumber(appointments: any[]): number | null {
    if (!appointments || appointments.length === 0) return null;

    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD
    const current = appointments.find(app =>
      app.patientStatus === 'inProcess' && app.appointmentDate === today
    );

    return current ? current.appointmentNumber : null;
  }

  ngOnInit() {
    this.username = this.authService.getUserName();
    this.fetchFavoritesAndDoctors();
  }

  toggleFavorite(doctorId: string) {
    const userId = this.authService.getUserId();
    const isFav = this.favoriteDoctorIds.includes(doctorId);

    const request = isFav
      ? this.patientService.removeFavouriteDoctor(userId, doctorId)
      : this.patientService.addFavouriteDoctor(userId, doctorId);

    request.subscribe(() => {
      this.fetchFavoritesAndDoctors(); // Re-fetch both & re-sort
    });
  }

  isFavorite(doctorId: string): boolean {
    return this.favoriteDoctorIds.includes(doctorId);
  }

  bookAppointment(doctors: any) {
    this.selectedDoctor = doctors;
    this.showModal = true;
  }

  confirmBooking() {
    if (!this.patientName || !this.patientAge) {
      this.toastr.error("Please fill required patient details", '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastr.error("User Id not found in local storage", '', {
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
        timeOut: 2000,
      });
      return;
    }

    const loadData = {
      doctorId: this.selectedDoctor.doctor._id,
      userId: userId,
      patientName: this.patientName,
      patientAge: this.patientAge,
      patientProblem: this.patientProblem
    };

    this.patientService.bookAppointment(loadData).subscribe(
      (res: any) => {
        this.toastr.success("Appointment booked successfully", '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
        this.showModal = false;
        this.patientName = '';
        this.patientAge = null;
        this.patientProblem = '';
      },
      (err) => {
        this.toastr.error(err.error?.message || "Error booking appointment", '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000,
        });
      }
    );
    this.fetchFavoritesAndDoctors();

  }

  closeModal() {
    this.showModal = false;
    this.patientName = '';
    this.patientAge = null;
    this.patientProblem = '';
  }

  viewProfile(doctorId: any) {
    this.doctorService.getDoctorProfile(doctorId).subscribe(
      (res: any) => {
        if (res.success) {
          this.myProfile = res.myProfile;
          this.showProfileModal = true;
        } else {
          this.toastr.error("Doctor information not found", '', {
            positionClass: 'toast-top-center',
            toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
            timeOut: 2000,
          });
        }
      },
      (err) => {
        this.toastr.error('Error fetching doctor profile');
      }
    );
  }

  closeProfile() {
    this.showProfileModal = false;
  }

  // feedback
  openFeedbackModal(doctorId: string) {
    this.feedbackDoctorId = doctorId;
    this.showFeedbackModal = true;
  }


  submitFeedback() {
    const userId = localStorage.getItem('userId');
    const payload = {
      userId,
      doctorId: this.feedbackDoctorId,
      patientName: localStorage.getItem('userName'),
      rating: this.feedbackRating,
      comment: this.feedbackComment
    };

    this.patientService.giveFeedback(payload).subscribe(
      () => {
        this.toastr.success("Feedback submitted", '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000
        });
        this.showFeedbackModal = false;
        this.feedbackRating = 5;
        this.feedbackComment = '';
      },
      (err) => {
        this.toastr.error(err.error?.message || "Failed to submit feedback", '', {
          positionClass: 'toast-top-center',
          toastClass: 'ngx-toastr animate__animated animate__lightSpeedInRight',
          timeOut: 2000
        });
      }
    );
  }

  // ✅ Close Feedback Modal
  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackDoctorId = '';
    this.feedbackRating = 5;
    this.feedbackComment = '';
  }
}
