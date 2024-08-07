import { Component } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, BaseComponent } from '@shared';

import { AuthRoleService, AuthUserSelectComponent } from '../..';

@Component({
  selector: 'app-auth-role-grant',
  standalone: true,
  imports: [...SHARED_IMPORTS, AuthUserSelectComponent],
  templateUrl: './grant.component.html'
})
export class AuthRoleGrantComponent extends BaseComponent {
  /**角色ID */
  id!: number;
  /**列表页路径 */
  baseUrl: string = '/auth/role';
  /**主标题 */
  title: string = '编辑角色授权用户';
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'number', title: '角色ID' },
      name: { type: 'string', title: '角色名称' },
      description: { type: 'string', title: '角色说明' },
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
      },
      users: { type: 'number', title: '授权用户' }
    }
  };
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
    $id: { widget: 'text' },
    $name: { widget: 'text' },
    $description: { widget: 'text' },
    $create: { grid: { span: 24 }, $userId: { widget: 'user', grid: { span: 8 } }, $at: { widget: 'at', grid: { span: 8 } } },
    $update: {
      grid: { span: 24 },
      $userId: { widget: 'user', grid: { span: 8 } },
      $at: { widget: 'at', grid: { span: 8 } },
      $operateId: { widget: 'text', grid: { span: 8 } },
      $operate: { widget: 'operate', grid: { span: 8 } },
      $reqId: { widget: 'text', grid: { span: 8 } }
    },
    $users: { widget: 'custom', grid: { span: 24 } }
  };
  /**表单初始数据 */
  i: any;
  /**表单提交数据 */
  users: number[] = [];

  /**
   * 构造函数
   * @param roleSrv 角色服务
   */
  constructor(private roleSrv: AuthRoleService) {
    super();
    this.main = 'auth';
    this.baseUrl = '/auth/role';
    this.id = Number(this.route.snapshot.params['id']);
    this.reload = () => {
      this.roleSrv.show(this.id).subscribe(res => {
        this.i = res;
        this.loading = false;
      });
    };
  }

  save(back: boolean = true): void {
    if (this.users.length === 0) {
      this.message.warning('请先选择授权用户');
      return;
    }
    this.roleSrv.grant(this.id, this.users).subscribe(res => {
      if (res && back) {
        this.router.navigateByUrl(this.baseUrl);
      }
      console.debug('res', res);
    });
  }
}
