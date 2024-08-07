import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService, TitleService } from '@delon/theme';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
  standalone: true,
  imports: [RouterOutlet, GlobalFooterModule, NzIconModule, ThemeBtnComponent]
})
export class LayoutPassportComponent {
  private tokenService = inject(DA_SERVICE_TOKEN);
  private titleService = inject(TitleService);
  private settingSrv = inject(SettingsService);
  name: string;
  description: string;
  company: string;
  domain: string;
  icp: string;

  constructor() {
    this.tokenService.clear();
    const app: any = this.settingSrv.getApp();
    console.debug('登陆获取到的应用信息', app);
    this.name = app.name || '管理平台';
    this.description = app.description || '平台在手，天下我有';
    this.company = app.company || '***公司';
    this.domain = app.domain || '***.com';
    this.icp = app.icp || '*ICP备*号-*';
    this.titleService.suffix = app.title || '管理平台';
  }
}
