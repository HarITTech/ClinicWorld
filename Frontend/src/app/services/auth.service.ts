import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // Doctor methods
  getDoctorId(): string {
    return localStorage.getItem('doctorId') || '';
  }

  getDoctorName(): string {
    return localStorage.getItem('doctorName') || '';
  }

  isClinicOpen(): boolean {
    return localStorage.getItem('isClinicOpen') === 'true';
  }

  setClinicOpen(status: boolean): void {
    localStorage.setItem('isClinicOpen', String(status));
  }

  // Patient methods
  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  setUserName(name: string): void{
    localStorage.setItem('userName', name);
  }

  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('isClinicOpen');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }
}
