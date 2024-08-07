import { Component } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, BaseComponent } from '@shared';

import { AuthUserService } from '../..';

@Component({
  selector: 'app-auth-user-resetpsw',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './resetpsw.component.html'
})
export class AuthUserResetpswComponent extends BaseComponent {
  backUrl = '/auth/user';
  /**用户ID */
  id!: number;
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      newPassword: { type: 'string', title: '新密码' },
      confirmPassword: { type: 'string', title: '确认密码' }
    },
    required: ['newPassword', 'confirmPassword']
  };
  /**表单样式 */
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100, grid: { span: 24 } },
    $newPassword: {
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
    $confirmPassword: {
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
        if (form.value.newPassword !== value) {
          msg.push({ keyword: 'not', message: '新密码与确认密码必须一致！' });
        }
        return msg;
      }
    }
  };
  value: any = {};

  constructor(private userSrv: AuthUserService) {
    super();
    this.id = Number(this.route.snapshot.params['id']);
    this.reload = () => {};
  }

  change(value: any) {
    console.debug('value', value);
    this.value = value;
  }

  save(): void {
    console.debug('value', this.value);
    if (!this.value?.newPassword) {
      this.message.warning('新密码必须填写');
      return;
    }
    this.userSrv.resetpsw({ id: this.id, newPassword: this.value.newPassword }).subscribe(res => {
      console.debug('res', res);
      this.message.success('密码重置成功');
      this.router.navigateByUrl(this.backUrl);
    });
  }
}
