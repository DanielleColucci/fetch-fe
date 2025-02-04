import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type DogSearchCriteria = {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sortField?: 'breed' | 'name' | 'age';
  sortDirection?: 'asc' | 'desc';
};

export type SearchResult = {
  next?: string;
  prev?: string;
  resultIds: string[];
  total: number;
};

export type Dog = {
  age: number;
  breed: string;
  id: string;
  img: string;
  name: string;
  zip_code: string;
};

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

  search(criteria: DogSearchCriteria) {
    const params = new URLSearchParams();
    if (criteria.breeds?.length)
      params.append('breeds', criteria.breeds.join(','));
    if (criteria.zipCodes?.length)
      params.append('zipCodes', criteria.zipCodes.join(','));
    if (criteria.ageMin) params.append('ageMin', criteria.ageMin.toString());
    if (criteria.ageMax) params.append('ageMax', criteria.ageMax.toString());
    if (criteria.size) params.append('size', criteria.size.toString());
    if (criteria.from) params.append('from', criteria.from.toString());
    if (criteria.sortField) {
      params.append(
        'sort',
        `${criteria.sortField}:${
          criteria.sortDirection ? criteria.sortDirection : 'asc'
        }`
      );
    }
    if (!criteria.sortField) {
      params.append('sort', 'breed:asc');
    }
    return this.#http.get<SearchResult>(`${this.#baseUrl}/dogs/search`, {
      params: new HttpParams({ fromString: params.toString() }),
      withCredentials: true,
    });
  }

  getDogs(ids: string[]) {
    if (ids?.length > 100) {
      throw new Error('Too many ids');
    }
    return this.#http.post<Dog[]>(`${this.#baseUrl}/dogs`, ids, {
      withCredentials: true,
    });
  }

  searchByUrl(url: string) {
    return this.#http.get<SearchResult>(`${this.#baseUrl}${url}`, {
      withCredentials: true,
    });
  }

  findMatch(ids: string[]) {
    return this.#http.post<{ match: string }>(
      `${this.#baseUrl}/dogs/match`,
      ids,
      {
        withCredentials: true,
      }
    );
  }
}
