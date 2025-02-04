import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../data-access/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

const MAT_MODULES = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatDividerModule,
];

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MAT_MODULES],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly isLoggedIn = this.#authService.isLoggedIn;
  async onLogout() {
    await firstValueFrom(this.#authService.logout());
    this.#router.navigate(['/login']);
  }
}
