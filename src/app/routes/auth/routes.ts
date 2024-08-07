import { Routes } from '@angular/router';

import {
  AuthAbilityService,
  AuthRoleService,
  AuthUserService,
  AuthTokenService,
  AuthLayoutComponent,
  AuthAbilityComponent,
  AuthAbilityGrantComponent,
  AuthRoleComponent,
  AuthRoleEditComponent,
  AuthRoleGrantComponent,
  AuthUserComponent,
  AuthUserEditComponent,
  AuthUserLogComponent,
  AuthUserResetpswComponent,
  AuthTokenComponent
} from '.';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    pathMatch: 'prefix',
    providers: [AuthAbilityService, AuthRoleService, AuthUserService, AuthTokenService],
    children: [
      { path: '', redirectTo: 'ability', pathMatch: 'full' },
      { path: 'ability', component: AuthAbilityComponent },
      { path: 'ability/menu/:id', component: AuthAbilityGrantComponent, data: { type: 'menu' } },
      { path: 'ability/role/:id', component: AuthAbilityGrantComponent, data: { type: 'role' } },
      { path: 'role', component: AuthRoleComponent },
      { path: 'role/add', component: AuthRoleEditComponent, data: { type: 'add' } },
      { path: 'role/edit/:id', component: AuthRoleEditComponent, data: { type: 'edit' } },
      { path: 'role/copy/:id', component: AuthRoleEditComponent, data: { type: 'copy' } },
      { path: 'role/grant/:id', component: AuthRoleGrantComponent },
      { path: 'user', component: AuthUserComponent },
      { path: 'user/add', component: AuthUserEditComponent, data: { type: 'add' } },
      { path: 'user/edit/:id', component: AuthUserEditComponent, data: { type: 'edit' } },
      { path: 'user/copy/:id', component: AuthUserEditComponent, data: { type: 'copy' } },
      { path: 'user/log/:id', component: AuthUserLogComponent },
      { path: 'user/resetpsw/:id', component: AuthUserResetpswComponent },
      { path: 'token', component: AuthTokenComponent }
    ]
  }
];
