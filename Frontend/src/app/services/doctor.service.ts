import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  // private apiUrl = 'http://localhost:4800/doctors';
  private apiUrl = 'https://clinic-world.onrender.com/doctors';

  constructor(private http: HttpClient) { }

  registration(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  additionalInfo(doctorId: any, data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/upload-doctor-details/${doctorId}`, data);
  }

  registerDoctor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getDoctorProfile(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/my-profile/${id}`, { headers });
  }

  toggleClinicStatus(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/toggle-clinic/${id}`, {});
  }

  // getAllDoctors(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/get-all-doctors`);
  // }

  getAllDoctors(lat?: number, lng?: number): Observable<any> {
  let url = `${this.apiUrl}/get-all-doctors`;

  if (lat !== undefined && lng !== undefined) {
    url += `?lat=${lat}&lng=${lng}`;
  }

  return this.http.get(url);
}

  getTodaysAppointments(doctorId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-todays-appointments/${doctorId}`, { headers });
  }

  getCompletedAppointments(doctorId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-completed-appointments/${doctorId}`, { headers });
  }

  getNotCheckedAppointments(doctorId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-not-check-appointments/${doctorId}`, { headers });
  }

  updateAppointmentStatus(doctorId: string, appointmentId: string, status: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/update-patient-status/${doctorId}/${appointmentId}`, { status }, { headers });
  }

  getPatientAppointment(doctorId: string, apptId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-patient-appointment/${doctorId}/${apptId}`, { headers });
  }

  getOldCompletedAppointments(doctorId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-old-completed-appointments/${doctorId}`, { headers });
  }

  getOldNotCheckedAppointments(doctorId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-old-notcheck-appointments/${doctorId}`, { headers });
  }

  getBarChartData(doctorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-bar-data/${doctorId}`);
  }

  getPieChartData(doctorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-pie-data/${doctorId}`);
  }

  updateDoctorProfile(doctorId: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/update-doctor-profile/${doctorId}`, formData, { headers });
  }

  changePassword(doctorId: string, data: any): Observable<any> {
    // const token = localStorage.getItem('authToken');
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`
    // });
    return this.http.put(`${this.apiUrl}/change-password/${doctorId}`, data);
  }

    // Create subscription (free or paid plan)
  createSubscription(doctorId: string, planType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-subscription`, { doctorId, planType });
  }

  // Verify payment after Razorpay success
  verifyPayment(doctorId: string, planType: string, paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-payment`, { doctorId, planType, paymentId });
  }
}
