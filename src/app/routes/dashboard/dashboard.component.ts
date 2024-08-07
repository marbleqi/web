import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { I18nPipe, SettingsService, User, MenuService, Menu } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderModule, ...SHARED_IMPORTS]
})
export class DashboardComponent {
  constructor(
    private readonly settingSrv: SettingsService,
    private readonly menuSrv: MenuService
  ) {
    this.settingSrv.setLayout('hideAside', true);
  }
}
