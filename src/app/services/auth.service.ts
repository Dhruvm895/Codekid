import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Your backend URL
  private tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<any>(null);

  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('🔧 AuthService initialized with API URL:', this.apiUrl);
    // Don't auto-check token to avoid circular dependency with interceptor
    // Token check will be done manually when needed
  }

  private checkExistingToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Verify token with backend
      this.verifyToken(token).subscribe({
        next: (response) => {
          if (response.valid) {
            this.userSubject.next(response.user);
          } else {
            this.logout();
          }
        },
        error: () => this.logout()
      });
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;

    console.log('📡 Making HTTP POST request to:', url);
    console.log('📤 Request payload:', { email: credentials.email, password: '[HIDDEN]' });

    return this.http.post<LoginResponse>(url, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        console.log('📥 Raw response from server:', response);

        if (response.success && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.userSubject.next(response.user);
          console.log('✅ Login successful, token stored');
        }
      })
    );
  }

  register(userData: RegisterData): Observable<any> {
    const url = `${this.apiUrl}/register`;
    console.log('📡 Making HTTP POST request to:', url);

    return this.http.post(url, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('rememberMe');
    this.userSubject.next(null);
    console.log('🚪 User logged out, tokens cleared');
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    console.log('📡 Making HTTP POST request to:', url);

    return this.http.post(url, { email }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  private verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/verify`, { headers });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }

  // Manual token check method to avoid circular dependency
  checkAuthStatus(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Verify token with backend
      this.verifyToken(token).subscribe({
        next: (response) => {
          if (response.valid) {
            this.userSubject.next(response.user);
          } else {
            this.logout();
          }
        },
        error: () => this.logout()
      });
    }
  }
}
