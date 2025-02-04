import {
  AfterViewInit,
  Component,
  OnChanges,
  ViewChild,
  input,
} from '@angular/core';
import { Dog } from '../../data-access/dogs.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MAT_MODULES = [
  MatTableModule,
  MatPaginatorModule,
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
  dataSource = new MatTableDataSource<Dog>(this.dogs());

  displayedColumns: string[] = [
    'name',
    'img',
    'breed',
    'age',
    'zipCode',
    'favorite',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.dogs()) {
      this.dataSource.data = this.dogs()!;
      this.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFavorite(dog: Dog) {
    console.log('favorite', dog);
  }
}
