import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'typing_test_token';

  isAuthenticated = signal<boolean>(
    localStorage.getItem(this.tokenKey) !== null
  );

  constructor(private http: HttpClient) {}

  register(
    username: string,
    email: string,
    password: string
  ): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      { username, email, password },
      { responseType: 'text' }
    );
  }

  login(
    username: string,
    password: string
  ): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { username, password },
      { responseType: 'text' }
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  refreshAuthState(): void {
  this.isAuthenticated.set(
    localStorage.getItem(this.tokenKey) !== null
  );
}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }
}