// src/app/services/login.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // private baseUrl = 'http://localhost:4800';
  private baseUrl = 'https://clinic-world.onrender.com';

  constructor(private http: HttpClient) {}

  getDoctorIdByEmail(email: string): Promise<string | null> {
    return this.http.get<any>(`${this.baseUrl}/doctors/get-only-all-doctors`).toPromise()
      .then(res => {
        const doctor = res?.doctors?.find((doc: any) => doc.email === email);
        return doctor ? doctor._id : null;
      })
      .catch(() => null);
  }

  login(role: string, credentials: any) {
    const url =
      role === 'patient'
        ? `${this.baseUrl}/user/user-login`
        : role === 'doctor'
          ? `${this.baseUrl}/doctors/login`
          : null;

    return this.http.post<any>(url!, credentials);
  }

  getDoctorDetailsById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/doctors/doctor-detail-info/${id}`);
  }
}
