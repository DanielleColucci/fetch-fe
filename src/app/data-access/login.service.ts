import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly #baseUrl = 'https://frontend-take-home-service.fetch.com';
  readonly #http = inject(HttpClient);

  login(loginRequest: { email: string; password: string }) {
    return this.#http.post(`${this.#baseUrl}/auth/login`, loginRequest, {
      responseType: 'text',
    });
  }
}
