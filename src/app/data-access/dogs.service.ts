import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DogsService {
  readonly #baseUrl = 'https://frontend-take-home-service.fetch.com';
  readonly #http = inject(HttpClient);

  getDogBreeds$() {
    return this.#http.get<string[]>(`${this.#baseUrl}/dogs/breeds`, {
      withCredentials: true,
    });
  }
}
