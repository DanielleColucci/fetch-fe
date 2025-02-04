import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #baseUrl = 'https://frontend-take-home-service.fetch.com';
  readonly #http = inject(HttpClient);
  readonly isLoggedIn = signal<boolean>(false);

  login(loginRequest: { email: string; password: string }) {
    return this.#http.post(`${this.#baseUrl}/auth/login`, loginRequest, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  logout() {
    return this.#http.post(`${this.#baseUrl}/auth/logout`, null, {
      responseType: 'text',
      withCredentials: true,
    });
  }
}
