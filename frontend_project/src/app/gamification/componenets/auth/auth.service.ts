import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    avatarUrl: string | null;
    xpTotal: number;
    niveau: number;
    dateCreation: string;
}

export interface AuthResponse {
    token: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    motDePasse: string;
}

export interface RegisterRequest {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API_URL = '/api/auth';
    private readonly TOKEN_KEY = 'auth_token';

    private _user = signal<UserProfile | null>(null);
    user = this._user.asReadonly();
    isAuthenticated = computed(() => !!this.getToken());

    constructor(private http: HttpClient, private router: Router) {
        if (this.getToken()) {
            this.loadProfile();
        }
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                this.loadProfile();
            })
        );
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, request).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                this.loadProfile();
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this._user.set(null);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    loadProfile(): void {
        this.http.get<UserProfile>(`${this.API_URL}/profile`).subscribe({
            next: user => this._user.set(user),
            error: (err) => {
                if (err.status === 401 || err.status === 403) {
                    localStorage.removeItem(this.TOKEN_KEY);
                    this._user.set(null);
                    this.router.navigate(['/auth/login']);
                }
            }
        });
    }
}
