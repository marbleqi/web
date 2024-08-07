import { Routes } from '@angular/router';

import { AccountSettingsComponent, AccountSecureComponent } from '.';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [],
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'settings', component: AccountSettingsComponent },
      { path: 'secure', component: AccountSecureComponent }
    ]
  }
];
