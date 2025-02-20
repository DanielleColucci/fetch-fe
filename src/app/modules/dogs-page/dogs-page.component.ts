import {
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  Dog,
  DogSearchCriteria,
  DogsService,
} from '../../data-access/dogs.service';
import { firstValueFrom } from 'rxjs';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { AuthService } from '../../data-access/auth.service';

const MAT_MODULES = [
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
];

@Component({
  selector: 'app-dogs-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SearchResultsComponent,
    MAT_MODULES,
  ],
  templateUrl: './dogs-page.component.html',
  styleUrl: './dogs-page.component.css',
})
export class DogsPageComponent implements OnInit {
  readonly #dogsService = inject(DogsService);
  readonly #authService = inject(AuthService);
  readonly #fb = inject(FormBuilder);

  @ViewChild(MatExpansionPanel) matExpansionPanel!: MatExpansionPanel;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly currentBreed = model('');
  breeds = signal<string[]>([]);
  readonly filteredBreeds = computed(() => {
    const currentBreed = this.currentBreed().toLowerCase();
    return currentBreed
      ? this.breeds().filter((breed) =>
          breed.toLowerCase().includes(currentBreed)
        )
      : this.breeds().slice();
  });

  readonly currentZipCode = model('');

  searchForm = this.#fb.group({
    breeds: [[] as string[]],
    zipCodes: [[] as string[]],
    ageMin: [null as number | null],
    ageMax: [null as number | null, Validators.max(100)],
    size: [null as number | null],
    from: [null as number | null],
    sortField: ['' as 'breed' | 'name' | 'age'],
    sortDirection: ['' as 'asc' | 'desc'],
  });
  searchResults = signal<Dog[]>([]);
  nextUrl = signal<string | null>(null);
  prevUrl = signal<string | null>(null);
  total = signal<number | null>(null);
  pageSize = signal<number | null>(null);

  async ngOnInit() {
    const breeds = await firstValueFrom(this.#dogsService.getDogBreeds$());
    this.breeds.set(breeds);
    this.#authService.isLoggedIn.set(true);
  }

  breedSelected(event: MatAutocompleteSelectedEvent): void {
    const breedsControl = this.searchForm.get('breeds');
    if (breedsControl && breedsControl.value) {
      breedsControl.setValue([...breedsControl.value, event.option.value]);
      this.currentBreed.set('');
    }
  }

  remove(control: 'breed' | 'zipCode', value: string) {
    const formControl = this.searchForm.get(
      control === 'breed' ? 'breeds' : 'zipCodes'
    );
    if (formControl) {
      const updatedBreeds = (formControl.value as string[])?.filter(
        (x: string) => x !== value
      );
      formControl.setValue(updatedBreeds);
    }
  }

  onClear(control: 'breed' | 'zipCode') {
    if (control === 'breed') {
      this.currentBreed.set('');
    } else {
      this.currentZipCode.set('');
    }
    const formControl = this.searchForm.get(
      control === 'breed' ? 'breeds' : 'zipCodes'
    );
    formControl?.setValue([]);
  }

  add(event: MatChipInputEvent): void {
    const formControl = this.searchForm.get('zipCodes');
    const value = (event.value || '').trim();

    if (value && formControl) {
      formControl.value?.push(value);
    }

    event.chipInput?.clear();
  }

  edit(item: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove('zipCode', item);
      return;
    }

    const formControl = this.searchForm.get('zipCodes');
    if (formControl) {
      const index = formControl.value?.indexOf(item);
      console.log(index);
      if (index && index >= 0) {
        formControl.setValue(
          formControl.value
            ? formControl.value.map((v: string, i: number) =>
                i === index ? value : v
              )
            : []
        );
      }
    }
  }

  async onSearch() {
    const results = await firstValueFrom(
      this.#dogsService.search(this.searchForm.value as DogSearchCriteria)
    );
    this.nextUrl.set(results.next || null);
    this.prevUrl.set(results.prev || null);
    this.total.set(results.total);
    const dogs = await firstValueFrom(
      this.#dogsService.getDogs(results.resultIds)
    );
    if (this.searchForm.value.size) {
      this.pageSize.set(this.searchForm.value.size);
    }
    this.searchResults.set(dogs);
    this.matExpansionPanel.close();
  }

  async onGetNext(direction: 'next' | 'prev') {
    if (direction === 'next' && !this.nextUrl()) {
      console.warn('No next URL');
      return;
    }
    if (direction === 'prev' && !this.prevUrl()) {
      console.warn('No previous URL');
      return;
    }
    const results = await firstValueFrom(
      this.#dogsService.searchByUrl(
        direction === 'next' ? this.nextUrl()! : this.prevUrl()!
      )
    );
    this.nextUrl.set(results.next || null);
    this.prevUrl.set(results.prev || null);
    this.total.set(results.total);
    const dogs = await firstValueFrom(
      this.#dogsService.getDogs(results.resultIds)
    );
    if (this.searchForm.value.size) {
      this.pageSize.set(this.searchForm.value.size);
    }
    this.searchResults.set(dogs);
  }
}
