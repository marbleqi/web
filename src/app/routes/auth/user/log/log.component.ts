import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS, BaseComponent } from '@shared';

@Component({
  selector: 'app-auth-user-log',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './log.component.html'
})
export class AuthUserLogComponent extends BaseComponent {}
