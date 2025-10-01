import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  // private apiUrl = 'http://localhost:4800/user';
  private apiUrl = 'https://clinic-world.onrender.com/user';

  constructor(
    private http: HttpClient
  ) { }

  registration(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user-registration`, data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-users`);
  }

  getFavoriteDoctors(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-favorites/${userId}`);
  }

  addFavouriteDoctor(userId: string, doctorId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-favorite`, { userId, doctorId });
  }

  removeFavouriteDoctor(userId: string, doctorId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-favorite`, { userId, doctorId });
  }

  getUserProfile(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-user-profile/${userId}`, { headers });
  }

  bookAppointment(appointmentData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/book-appointment`, appointmentData, { headers });
  }

  giveFeedback(feedbackData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/give-feedback`, feedbackData);
  }

  updateProfile(userId: string, updateData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/update-profile/${userId}`, updateData, { headers});
  }

  changePassword(userId: string, passwordData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/change-password/${userId}`, passwordData, { headers });
  }

  getMyAppointments(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/get-my-appointments/${userId}`, { headers });
  }

  editAppointment(doctorId: string, appointmentId: string, updateData: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/edit-appointment/${doctorId}/${appointmentId}`, updateData, { headers });
  }

  cancelAppointment(doctorId: string, appointmentId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/cancel-appointment/${doctorId}/${appointmentId}`, { headers });
  }

  getOldAppointments(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/my-old-appointments/${userId}`, { headers });
  }
}
