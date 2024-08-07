import { Component } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS, EditComponent, AvatarComponent } from '@shared';

import { AuthUserService, AuthRoleSelectComponent } from '../..';

@Component({
  selector: 'app-auth-user-edit',
  standalone: true,
  imports: [...SHARED_IMPORTS, AvatarComponent, AuthRoleSelectComponent],
  templateUrl: './edit.component.html'
})
export class AuthUserEditComponent extends EditComponent {
  /**用户ID */
  id!: number;
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'number', title: '用户ID' },
      loginName: { type: 'string', title: '登陆名' },
      name: { type: 'string', title: '姓名' },
      avatar: { type: 'string', title: '头像' },
      email: { type: 'string', title: '电子邮箱' },
      locked: {
        type: 'boolean',
        title: '锁定',
        default: true,
        enum: [
          { value: true, label: '锁定' },
          { value: false, label: '未锁定' }
        ]
      },
      status: {
        type: 'boolean',
        title: '状态',
        default: true,
        enum: [
          { value: true, label: '有效' },
          { value: false, label: '禁用' }
        ]
      },
      config: {
        type: 'object',
        title: '',
        properties: {
          pswLogin: { type: 'boolean', title: '允许密码登陆' },
          qrLogin: { type: 'boolean', title: '允许扫码登陆' },
          appLogin: { type: 'boolean', title: '允许APP登陆' }
        }
      },
      roles: { type: 'number', title: '用户授权角色' },
      create: {
        type: 'object',
        title: '',
        properties: { userId: { type: 'number', title: '创建用户' }, at: { type: 'number', title: '创建时间' } }
      },
      update: {
        type: 'object',
        title: '',
        properties: {
          userId: { type: 'number', title: '更新用户' },
          at: { type: 'number', title: '更新时间' },
          operateId: { type: 'number', title: '操作ID' },
          operate: { type: 'string', title: '操作类型' },
          reqId: { type: 'number', title: '请求ID' }
        }
      }
    }
  };

  /**
   * 构造函数
   * @param userSrv 用户服务
   */
  constructor(private userSrv: AuthUserService) {
    super();
    this.main = 'auth';
    this.baseUrl = '/auth/user';
    this.name = '用户';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $avatar: { widget: 'custom', grid: { span: 16 } },
      $locked: { widget: 'radio', styleType: 'button', buttonStyle: 'solid', grid: { span: 8 } },
      $status: { widget: 'radio', styleType: 'button', buttonStyle: 'solid', grid: { span: 8 } },
      $config: { grid: { span: 24 }, $pswLogin: { grid: { span: 8 } }, $qrLogin: { grid: { span: 8 } }, $appLogin: { grid: { span: 8 } } },
      $roles: { widget: 'custom', grid: { span: 24 } },
      $create: { grid: { span: 24 }, $userId: { widget: 'user', grid: { span: 8 } }, $at: { widget: 'at', grid: { span: 8 } } },
      $update: {
        grid: { span: 24 },
        $userId: { widget: 'user', grid: { span: 8 } },
        $at: { widget: 'at', grid: { span: 8 } },
        $operateId: { widget: 'text', grid: { span: 8 } },
        $operate: { widget: 'operate', grid: { span: 8 } },
        $reqId: { widget: 'text', grid: { span: 8 } }
      }
    };
    this.reload = () => {
      this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : 0;
      this.edit();
    };
    this.show = () => this.userSrv.show(this.id);
    this.create = () => this.userSrv.create(this.value);
    this.update = () => this.userSrv.update(this.id, this.value);
  }
}
