import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nPipe, SettingsService, User, MenuService, Menu } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AuthLayoutComponent {
  constructor(
    private readonly settingSrv: SettingsService,
    private readonly menuSrv: MenuService
  ) {
    this.settingSrv.setLayout('hideAside', false);
    this.menuSrv.clear();
    this.menuSrv.add([
      {
        text: '访问控制',
        group: true,
        children: [
          {
            text: '权限点',
            link: '/auth/ability',
            icon: { type: 'icon', value: 'safety-certificate' }
          },
          {
            text: '角色',
            link: '/auth/role',
            icon: { type: 'icon', value: 'team' }
          },
          {
            text: '用户',
            link: '/auth/user',
            icon: { type: 'icon', value: 'user' }
          },
          {
            text: '令牌',
            link: '/auth/token',
            icon: { type: 'icon', value: 'key' }
          },
          {
            text: '返回',
            link: '/dashboard',
            icon: { type: 'icon', value: 'left' }
          }
        ]
      }
    ]);
  }
}
