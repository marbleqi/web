import { Component } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS, EditComponent } from '@shared';

import { AuthRoleService, AuthAbilitySelectComponent } from '../..';

@Component({
  selector: 'app-auth-role-edit',
  standalone: true,
  imports: [...SHARED_IMPORTS, AuthAbilitySelectComponent],
  templateUrl: './edit.component.html'
})
export class AuthRoleEditComponent extends EditComponent {
  /**角色ID */
  id!: number;
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'number', title: '角色ID' },
      name: { type: 'string', title: '角色名称' },
      description: { type: 'string', title: '角色说明' },
      status: {
        type: 'boolean',
        title: '状态',
        default: true,
        enum: [
          { value: true, label: '有效' },
          { value: false, label: '禁用' }
        ]
      },
      abilities: { type: 'number', title: '授权权限点' },
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
    },
    required: ['name', 'description', 'status', 'abilities']
  };

  /**
   * 构造函数
   * @param roleSrv 角色服务
   */
  constructor(private roleSrv: AuthRoleService) {
    super();
    this.main = 'auth';
    this.baseUrl = '/auth/role';
    this.name = '角色';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $status: { widget: 'radio', styleType: 'button', buttonStyle: 'solid', grid: { span: 8 } },
      $abilities: { widget: 'custom', grid: { span: 24 } },
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
    this.show = () => this.roleSrv.show(this.id);
    this.create = () => this.roleSrv.create(this.value);
    this.update = () => this.roleSrv.update(this.id, this.value);
  }
}
