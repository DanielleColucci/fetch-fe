import {
  AfterViewInit,
  Component,
  OnChanges,
  ViewChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Dog, DogsService } from '../../data-access/dogs.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  IConfirmDialogData,
} from '../confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';
import { MatchedDogDialogComponent } from '../matched-dog-dialog/matched-dog-dialog.component';

const MAT_MODULES = [
  MatTableModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
];

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [MAT_MODULES],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements AfterViewInit, OnChanges {
  readonly dogs = input<Dog[]>();
  readonly pageSize = input<number>(25);
  readonly allowNext = input<boolean>(false);
  readonly allowPrevious = input<boolean>(false);
  readonly total = input<number | null>(null);
  readonly #snackBar = inject(MatSnackBar);
  readonly #dialog = inject(MatDialog);
  readonly #dogsService = inject(DogsService);

  dataSource = new MatTableDataSource<Dog>(this.dogs());
  displayedColumns: string[] = [
    'name',
    'img',
    'breed',
    'age',
    'zipCode',
    'favorite',
  ];

  favorites = signal<Dog[]>([]);

  @ViewChild(MatSort) sort!: MatSort;

  onGetNextPage = output<void>();
  onGetPreviousPage = output<void>();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.dogs()) {
      this.dataSource.data = this.dogs()!;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFavorite(dog: Dog) {
    if (this.favorites().includes(dog)) {
      this.#snackBar.open(
        `${dog.name} the ${dog.breed} is already in your favorites!`,
        'Dismiss',
        {
          duration: 7_000,
        }
      );
    } else {
      this.favorites.set([...this.favorites(), dog]);
    }
  }

  onGetNext() {
    this.onGetNextPage.emit();
  }

  onGetPrevious() {
    this.onGetPreviousPage.emit();
  }

  onRemoveFavorite(dog: Dog) {
    this.#dialog
      .open(ConfirmDialogComponent, {
        maxWidth: '500px',
        data: {
          title: 'Are you sure?',
          message: `Are you sure you would like to remove ${dog.name} the ${dog.breed} from your favorites?`,
          buttonLabel: 'YES',
          buttonColor: 'warn',
        } as IConfirmDialogData,
      })
      .afterClosed()
      .subscribe({
        next: (val) => {
          if (val) {
            this.favorites.set(this.favorites().filter((x) => x !== dog));
          }
        },
      });
  }

  async findMatch() {
    const match = await firstValueFrom(
      this.#dogsService.findMatch(this.favorites().map((f) => f.id))
    );
    const matchDog = this.favorites().find((f) => f.id === match.match);
    console.log(matchDog, match)
    if (matchDog) {
      this.#dialog.open(MatchedDogDialogComponent, {
        maxWidth: '800px',
        data: matchDog,
      });
    }
  }
}
