import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { SFButton, SFSchema, SFUISchema } from '@delon/form';
import { I18nPipe, User, MenuService, Menu, _HttpClient, SettingsService } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-secure',
  templateUrl: './secure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderModule, ...SHARED_IMPORTS]
})
export class AccountSecureComponent implements OnInit {
  record: any = {};
  i: any;
  button: SFButton = { edit: '提交' };
  schema: SFSchema = {
    properties: {
      oldpsw: { type: 'string', title: '原密码' },
      newpsw1: { type: 'string', title: '新密码' },
      newpsw2: { type: 'string', title: '确认新密码' }
    },
    required: ['oldpsw', 'newpsw1', 'newpsw2']
  };
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100, grid: { span: 24 } },
    $oldpsw: {
      widget: 'string',
      type: 'password',
      validator: (value, formProperty, form) => {
        if (form.value === null) {
          return [];
        }
        const msg = [];
        if (!value) {
          msg.push({ keyword: 'required', message: '原密码为必填项！' });
        }
        return msg;
      }
    },
    $newpsw1: {
      widget: 'string',
      type: 'password',
      validator: (value, formProperty, form) => {
        if (form.value === null) {
          return [];
        }
        const msg = [];
        if (!value) {
          msg.push({ keyword: 'required', message: '新密码为必填项！' });
        }
        return msg;
      }
    },
    $newpsw2: {
      widget: 'string',
      type: 'password',
      validator: (value, formProperty, form) => {
        if (form.value === null) {
          return [];
        }
        const msg = [];
        if (!value) {
          msg.push({ keyword: 'required', message: '确认密码为必填项！' });
        }
        if (form.value.newpsw1 !== value) {
          msg.push({ keyword: 'not', message: '新密码与确认密码必须一致！' });
        }
        return msg;
      }
    }
  };

  constructor(
    private http: _HttpClient,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    console.debug('AccountSecureComponent ngOnInit');
  }

  save(value: any): void {
    const params = { oldpsw: value.oldpsw, newpsw: value.newpsw1 };
    console.debug('value', value);
    this.http.post('/account/secure', params).subscribe(res => {
      if (res.code) {
        this.messageService.error(res.msg);
      } else {
        this.messageService.success('修改成功');
      }
    });
  }

  reset(): void {
    this.i = {};
  }
}
