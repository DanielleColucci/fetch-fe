import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

const MAT_MODULES = [MatDialogModule, MatButtonModule];

export interface IConfirmDialogData {
  title: string;
  message: string;
  buttonLabel: string;
  buttonColor?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MAT_MODULES],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  readonly data: IConfirmDialogData = inject(MAT_DIALOG_DATA);
}
