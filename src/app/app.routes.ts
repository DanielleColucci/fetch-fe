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
  {
    path: 'dogs',
    pathMatch: 'full',
    loadComponent: () =>
      import('./modules/dogs-page/dogs-page.component').then(
        (esm) => esm.DogsPageComponent
      ),
  },
];
