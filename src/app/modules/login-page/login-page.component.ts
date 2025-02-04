import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../data-access/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

const MAT_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
];

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, MAT_MODULES],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #authService = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);

  readonly loginForm = this.#fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.#authService.isLoggedIn.set(false);
  }

  async onSubmit() {
    const dialogRef: MatDialogRef<ProgressSpinnerDialogComponent> =
      this.#dialog.open(ProgressSpinnerDialogComponent, {
        panelClass: 'transparent',
        disableClose: true,
      });
    this.#authService
      .login(this.loginForm.value as { email: string; password: string })
      .subscribe({
        next: (res) => {
          dialogRef.close();
          if (res === 'OK') {
            this.#router.navigate(['/dogs']);
          }
        },
        error: (err) => {
          console.error('login error', err);
          this.#snackBar.open(
            `${err.status} ${err.error}: ${err.message}`,
            'Dismiss',
            {
              duration: 7_000,
            }
          );
          dialogRef.close();
        },
      });
  }
}
