import {
  AfterViewInit,
  Component,
  OnChanges,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { Dog } from '../../data-access/dogs.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MAT_MODULES = [
  MatTableModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
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
  dataSource = new MatTableDataSource<Dog>(this.dogs());

  displayedColumns: string[] = [
    'name',
    'img',
    'breed',
    'age',
    'zipCode',
    'favorite',
  ];

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
    console.log('favorite', dog);
  }

  onGetNext() {
    this.onGetNextPage.emit();
  }

  onGetPrevious() {
    this.onGetPreviousPage.emit();
  }
}
