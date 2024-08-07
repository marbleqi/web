import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { DashboardComponent, IconComponent } from '.';
import { LayoutBasicComponent } from '../layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { reuse: false } },
      { path: 'icon', component: IconComponent, data: { reuse: false } },
      { path: 'account', loadChildren: () => import('./account/routes').then(m => m.routes) },
      { path: 'auth', loadChildren: () => import('./auth/routes').then(m => m.routes) },
      { path: 'kong', loadChildren: () => import('./kong/routes').then(m => m.routes) }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
