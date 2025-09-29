import { Routes } from '@angular/router';
import { DoctorRegisterComponent } from './components/doctor-register/doctor-register.component';
import { UserRegisterComponent } from './components/patient-register/patient-register.component';
import { LoginComponent } from './components/login/login.component';
import { DoctorDashboardComponent } from './components/doctors/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patients/patient-dashboard/patient-dashboard.component';
import { HeaderComponent } from './components/landingPage/header/header.component';
import { PatientAppointmentsComponent } from './components/patients/patient-appointments/patient-appointments.component';
import { PatientHomeComponent } from './components/patients/patient-home/patient-home.component';
import { PatientProfileComponent } from './components/patients/patient-profile/patient-profile.component';
import { PatientHistoryComponent } from './components/patients/patient-history/patient-history.component';
import { DoctorHomeComponent } from './components/doctors/doctor-home/doctor-home.component';
import { DoctorCompletedApptsComponent } from './components/doctors/doctor-completed-appts/doctor-completed-appts.component';
import { DoctorNotcheckApptsComponent } from './components/doctors/doctor-notcheck-appts/doctor-notcheck-appts.component';
import { DoctorProfileComponent } from './components/doctors/doctor-profile/doctor-profile.component';
import { DoctorHistoryComponent } from './components/doctors/doctor-history/doctor-history.component';
import { DoctorAdditionalInfoComponent } from './components/doctor-additional-info/doctor-additional-info.component';
import { DoctorStatusPendingComponent } from './components/doctor-status-pending/doctor-status-pending.component';
import { DoctorStatusRejectedComponent } from './components/doctor-status-rejected/doctor-status-rejected.component';
import { ChangePasswordComponent } from './components/doctors/change-password/change-password.component';
import { AboutComponent } from './components/landingPage/about/about.component';
import { MainComponent } from './components/landingPage/main/main.component';
import { ServicesComponent } from './components/landingPage/services/services.component';
import { ContactComponent } from './components/landingPage/contact/contact.component';
import { SubscriptionComponent } from './components/doctors/subscription/subscription.component';

export const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', component: MainComponent, title: 'Home Page' },
      { path: 'about', component: AboutComponent, title: 'About Us' },
      { path: 'services', component: ServicesComponent, title: 'Services' },
      { path: 'contact', component: ContactComponent, title: 'Contact Us' },
    ]
  },
  { path: 'login', component: LoginComponent, title: 'Login Page' },
  { path: 'user-registration', component: UserRegisterComponent, title: 'User Registration Page' },
  { path: 'doctor-registration', component: DoctorRegisterComponent, title: 'Doctor Registration Page' },
  { path: 'doctor-additional-info', component: DoctorAdditionalInfoComponent, title: 'Additional Info' },
  { path: 'doctor-status-pending', component: DoctorStatusPendingComponent, title: 'Status' },
  { path: 'doctor-status-rejected', component: DoctorStatusRejectedComponent, title: 'Status' },
  { path: 'subscription', component: SubscriptionComponent, title: 'Subscription' },
  { path: 'change-password/:token', component: ChangePasswordComponent },
  {
    path: 'patient-dashboard',
    component: PatientDashboardComponent,
    children: [
      { path: 'home', component: PatientHomeComponent, title: 'Patient Home' },
      { path: 'appointments', component: PatientAppointmentsComponent, title: 'Patient Appointments' },
      { path: 'profile', component: PatientProfileComponent, title: 'Patient Profile' },
      { path: 'history', component: PatientHistoryComponent, title: 'Patient History' },
    ],
    title: 'Patient Dashboard'
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardComponent,
    children: [
      { path: 'home', component: DoctorHomeComponent, title: 'Doctor Home' },
      { path: 'completed', component: DoctorCompletedApptsComponent, title: 'Completed Appointments' },
      { path: 'not-check', component: DoctorNotcheckApptsComponent, title: 'Not Checked Appointments' },
      { path: 'profile', component: DoctorProfileComponent, title: 'Doctor Profile' },
      { path: 'history', component: DoctorHistoryComponent, title: 'Doctor History' },
    ],
    title: 'Doctor Dashboard'
  }
];
