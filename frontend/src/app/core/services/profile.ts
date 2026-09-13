import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../profile/profile';

export interface UserProfile {
  username: string;
  email: string;
  createdAt: string;      // or Date
  totalTests?: number;
  bestWpm?: number;
  averageWpm?: number;
  bestAccuracy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'https://simple-typing-test.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  getProfile() {
  return this.http.get<Profile>(`${this.apiUrl}/profile`);
}
}