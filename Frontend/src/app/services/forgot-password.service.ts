import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  // private apiUrl = 'http://localhost:4800';
  private apiUrl = 'https://clinic-world.onrender.com';

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, {email});
  }

  resetPassword(token: string, passwords: { password: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password?token=${token}`, passwords);
  }
}
