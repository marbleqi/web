import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { I18nPipe, SettingsService, User, MenuService, Menu } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { ArrayService } from '@delon/util';
import { environment } from '@env/environment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';

import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
import { HeaderSearchComponent } from './widgets/search.component';
import { HeaderUserComponent } from './widgets/user.component';

@Component({
  selector: 'layout-basic',
  templateUrl: './basic.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    I18nPipe,
    LayoutDefaultModule,
    SettingDrawerModule,
    ThemeBtnComponent,
    NzIconModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    NzWaterMarkModule,
    ReuseTabModule,
    HeaderSearchComponent,
    HeaderClearStorageComponent,
    HeaderFullScreenComponent,
    HeaderUserComponent
  ]
})
export class LayoutBasicComponent implements OnInit {
  hideAside: boolean = true;
  options: LayoutDefaultOptions = { logoExpanded: `./assets/logo.png`, logoCollapsed: `./assets/logo.png`, hideAside: true };

  searchToggleStatus = false;
  showSettingDrawer = !environment.production;
  get user(): User {
    return this.settingSrv.user;
  }
  /**水印内容 */
  mark!: string[];

  constructor(
    private readonly arraySrv: ArrayService,
    private readonly settingSrv: SettingsService,
    private readonly menuSrv: MenuService
  ) {
    this.settingSrv.notify.subscribe(res => {
      if (res.type === 'layout' && res.name === 'hideAside') {
        if (this.hideAside !== res.value) {
          this.hideAside = res.value;
          this.options = { ...this.options, hideAside: this.hideAside };
        }
      }
    });
  }

  ngOnInit(): void {
    this.mark = [this.settingSrv.user.name || '姓名', this.settingSrv.user.email || '邮箱'];
    // this.settingSrv.notify.subscribe(res => {
    //   if (res.type === 'layout' && res.name === 'main') {
    //     if (this.link !== res.value) {
    //       this.link = res.value;
    //       this.fresh();
    //     }
    //   }
    // });
    // this.baseSrv.menuWebSub.subscribe(link => {
    //   console.debug('收到前端菜单切换消息');
    //   if (this.link !== link) {
    //     this.link = link;
    //     this.fresh();
    //   }
    // });
    // this.baseSrv.menuApiSub.subscribe(() => {
    //   console.debug('收到后端菜单更新消息');
    //   this.fresh();
    // });
  }
}
