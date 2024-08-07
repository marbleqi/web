import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { SFButton, SFSchema, SFUISchema } from '@delon/form';
import { I18nPipe, SettingsService, User, MenuService, Menu } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderModule, ...SHARED_IMPORTS]
})
export class AccountSettingsComponent implements OnInit {
  i: any;
  button: SFButton = { edit: '修改' };
  schema: SFSchema = {
    properties: {
      userId: { type: 'string', title: '用户ID' },
      loginName: { type: 'string', title: '登陆名' },
      userName: { type: 'string', title: '用户姓名' },
      status: { type: 'string', title: '用户状态' },
      pswTimes: { type: 'number', title: '密码错误次数' },
      loginTimes: { type: 'number', title: '登陆次数' },
      firstLoginAt: { type: 'string', title: '首次登录时间' },
      lastLoginIp: { type: 'string', title: '最后登录IP' },
      lastLoginAt: { type: 'string', title: '最后登录时间' },
      lastSessionAt: { type: 'string', title: '最后会话时间' },
      createUserName: { type: 'string', title: '创建人' },
      createAt: { type: 'string', title: '创建时间' },
      updateUserName: { type: 'string', title: '最后更新人' },
      updateAt: { type: 'string', title: '最后更新时间' },
      operateId: { type: 'number', title: '最后操作序号' }
    },
    required: ['loginName']
  };
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100, grid: { span: 12 } },
    $userId: { widget: 'text' },
    $userName: { widget: 'text' },
    $status: { widget: 'text' },
    $pswTimes: { widget: 'text' },
    $loginTimes: { widget: 'text' },
    $firstLoginAt: { widget: 'text' },
    $lastLoginIp: { widget: 'text' },
    $lastLoginAt: { widget: 'text' },
    $lastSessionAt: { widget: 'text' },
    $createUserName: { widget: 'text' },
    $createAt: { widget: 'text' },
    $updateUserName: { widget: 'text' },
    $updateAt: { widget: 'text' },
    $operateId: { widget: 'text' }
  };
  constructor(private messageService: NzMessageService) {}

  ngOnInit(): void {
    this.reset();
  }

  change(value: any): void {
    const params = { loginName: value.loginName };
    console.debug('value', value);
    // this.accountService.change(params).subscribe(res => {
    //   if (res.code) {
    //     this.messageService.error(res.msg);
    //   } else {
    //     this.messageService.success('登陆名修改成功');
    //   }
    // });
  }

  reset(): void {
    // this.accountService.show().subscribe(res => {
    //   console.debug('用户信息', res);
    //   this.i = res;
    //   if (!this.i.config?.avatar) {
    //     this.i.config = { ...this.i.config, avatar: '' };
    //   }
    //   if (!this.i.config?.email) {
    //     this.i.config = { ...this.i.config, email: '' };
    //   }
    // });
  }
}
