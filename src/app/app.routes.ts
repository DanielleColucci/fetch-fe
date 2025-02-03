import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('./modules/login-page/login-page.component').then(
        (esm) => esm.LoginPageComponent
      ),
  },
];
