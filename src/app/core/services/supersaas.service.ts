import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupersaasService {
  private apiBase = 'https://www.supersaas.com/api'; // Base API URL
  private account = 'YOUR_ACCOUNT_NAME'; // Set in environment
  private apiKey = 'YOUR_API_KEY'; // Set in environment

  constructor(private http: HttpClient) {}

  // Example: Get all schedules
  getSchedules(): Observable<any> {
    return this.http.get(`${this.apiBase}/information?schedule=all`, {
      headers: this.getHeaders(),
    });
  }

  // Example: Get appointments for a schedule
  getAppointments(scheduleId: string): Observable<any> {
    return this.http.get(`${this.apiBase}/schedules/${scheduleId}/appointments`, {
      headers: this.getHeaders(),
    });
  }

  // Example: Create appointment
  createAppointment(scheduleId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/schedules/${scheduleId}/appointments`, data, {
      headers: this.getHeaders(),
    });
  }

  // Example: Get user info
  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiBase}/users/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  // Example: Create or update user
  upsertUser(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/users`, data, {
      headers: this.getHeaders(),
    });
  }

  // Helper for auth headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${btoa(this.account + ':' + this.apiKey)}`,
      'Content-Type': 'application/json',
    });
  }
}
