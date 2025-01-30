import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: ()=>import('./pages/home/home.component').then(m=>m.HomeComponent),
  },
  {
    path: 'add-book',
    loadComponent: ()=>import('./pages/add-book-form/add-book-form.component').then(m=>m.AddBookFormComponent),
  },
  {
    path: 'config',
    loadComponent: ()=>import('./pages/setting/setting.component').then(m=>m.SettingComponent),
  }
];
