import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nPipe, SettingsService, User, MenuService, Menu } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-kong-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class KongLayoutComponent {
  constructor(
    private readonly settingSrv: SettingsService,
    private readonly menuSrv: MenuService
  ) {
    this.settingSrv.setLayout('hideAside', false);
    this.menuSrv.clear();
    this.menuSrv.add([
      {
        text: 'KONG',
        group: true,
        children: [
          {
            text: '实例',
            link: '/kong/instance',
            icon: { type: 'icon', value: 'safety-certificate' }
          },
          {
            text: '路由',
            link: '/kong/list/route',
            icon: { type: 'icon', value: 'team' }
          },
          {
            text: '服务',
            link: '/kong/list/service',
            icon: { type: 'icon', value: 'user' }
          },
          {
            text: '用户',
            link: '/kong/list/consumer',
            icon: { type: 'icon', value: 'key' }
          },
          {
            text: '上游',
            link: '/kong/list/upstream',
            icon: { type: 'icon', value: 'key' }
          },
          {
            text: '插件',
            link: '/kong/list/plugin',
            icon: { type: 'icon', value: 'key' }
          },
          {
            text: '证书',
            link: '/kong/list/ssl',
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
