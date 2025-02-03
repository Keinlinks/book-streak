import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'add-book',
    loadComponent: () =>
      import('./pages/add-book-form/add-book-form.component').then(
        (m) => m.AddBookFormComponent
      ),
  },
  {
    path: 'add-book/:id',
    loadComponent: () =>
      import('./pages/add-book-form/add-book-form.component').then(
        (m) => m.AddBookFormComponent
      ),
  },
  {
    path: 'logs/:id',
    loadComponent: ()=>import('./pages/logs-book/logs-book.component').then(m => m.LogsBookComponent),
  },

  {
    path: 'config',
    loadComponent: () =>
      import('./pages/setting/setting.component').then(
        (m) => m.SettingComponent
      ),
  },
];
