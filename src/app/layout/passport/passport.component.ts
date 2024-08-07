import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { TitleService } from '@delon/theme';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
  standalone: true,
  imports: [RouterOutlet, GlobalFooterModule, NzIconModule, ThemeBtnComponent]
})
export class LayoutPassportComponent implements OnInit {
  private tokenService = inject(DA_SERVICE_TOKEN);
  private titleService = inject(TitleService);
  name!: string;
  description!: string;
  company!: string;
  domain!: string;
  icp!: string;

  ngOnInit(): void {
    this.tokenService.clear();
    this.name = '管理平台';
    this.description = '平台在手，天下我有';
    this.company = '***公司';
    this.domain = '***.com';
    this.icp = '*ICP备*号-*';
    this.titleService.suffix = '管理平台';
  }
}
