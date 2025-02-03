import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progress-spinner-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-spinner-dialog.component.html',
  styleUrl: './progress-spinner-dialog.component.css',
})
export class ProgressSpinnerDialogComponent {}
