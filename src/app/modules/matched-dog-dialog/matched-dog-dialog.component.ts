import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const MAT_MODULES = [MatDialogModule, MatButtonModule];

@Component({
  selector: 'app-matched-dog-dialog',
  standalone: true,
  imports: [MAT_MODULES],
  templateUrl: './matched-dog-dialog.component.html',
  styleUrl: './matched-dog-dialog.component.css',
})
export class MatchedDogDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    console.log(this.data);
  }
}
