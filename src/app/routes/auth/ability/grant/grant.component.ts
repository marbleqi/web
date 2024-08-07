import { Component, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, BaseComponent } from '@shared';

import { AuthAbilityService, AuthRoleSelectComponent } from '../..';

@Component({
  selector: 'app-auth-ability-grant',
  standalone: true,
  imports: [...SHARED_IMPORTS, AuthRoleSelectComponent],
  templateUrl: './grant.component.html'
})
export class AuthAbilityGrantComponent extends BaseComponent {
  /**授权对象类型 */
  type!: 'menu' | 'role';
  /**列表页路径 */
  baseUrl!: string;
  /**授权权限点ID */
  id!: number;
  /**主标题 */
  title: string = '';
  /**表单 */
  // @ViewChild('sf') readonly sf!: SFComponent;
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'number', title: '权限点ID' },
      pid: { type: 'number', title: '上级权限点ID' },
      name: { type: 'string', title: '权限名称' },
      description: { type: 'string', title: '权限说明' },
      type: { type: 'string', title: '权限点类型' },
      moduleName: { type: 'string', title: '所属模块' },
      objectName: { type: 'string', title: '所属对象' },
      params: { type: 'number', title: '授权对象' }
    },
    required: ['params']
  };
  /**表单样式 */
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100, grid: { span: 12 } },
    $id: { widget: 'text' },
    $pid: { widget: 'text' },
    $name: { widget: 'text' },
    $description: { widget: 'text' },
    $type: { widget: 'text' },
    $moduleName: { widget: 'text' },
    $objectName: { widget: 'text' },
    $params: { widget: 'custom', grid: { span: 24 } }
  };
  /**表单初始数据 */
  i: any;
  /**表单提交数据 */
  value: any;

  /**
   * 构造函数
   *
   * @param modal 模式对话框
   */
  constructor(private readonly abilitySrv: AuthAbilityService) {
    super();
    this.main = 'auth';
    this.baseUrl = '/auth/ability';
    this.reload = () => {
      this.type = this.route.snapshot.data['type'];
      this.id = Number(this.route.snapshot.params['id']);
      if (this.type === 'menu') {
        this.title = `编辑授权菜单`;
      } else {
        this.title = `编辑授权角色`;
      }
      this.abilitySrv.show(this.id).subscribe(res => {
        this.i = res;
        this.loading = false;
      });
    };
  }

  save(back: boolean = true): void {
    if (this.value?.params && Array.isArray(this.value.params)) {
      this.abilitySrv.grant(this.type, this.id, this.value.params).subscribe(res => {
        if (res && back) {
          this.router.navigateByUrl(this.baseUrl);
        }
        console.debug('res', res);
      });
    } else {
      this.message.warning('表单填写不完整');
    }
  }
}
