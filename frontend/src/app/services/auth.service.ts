import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { AuthResponse } from '../model/auth-response';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usernameSubject: BehaviorSubject<string | null>;
  usernameObs: Observable<string | null>;

  constructor(private httpClient: HttpClient) {
    const username = this.getUsername();
    this.usernameSubject = new BehaviorSubject<string | null>(username);
    this.usernameObs = this.usernameSubject.asObservable();
  }

  login(user: User): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>('/login', user)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.usernameSubject.next(null);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUsername(): string | null {
    console.log('getUsername()');
    console.log(localStorage.getItem('username'));
    console.log(localStorage.getItem('token'));
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(result: AuthResponse): void {
    localStorage.setItem('token', result.token);
    localStorage.setItem('username', result.username);
    this.usernameSubject.next(result.username);
  }
}
