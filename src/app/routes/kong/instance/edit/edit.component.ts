import { Component } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS, EditComponent } from '@shared';

import { KongInstanceService } from '../..';

@Component({
  selector: 'app-kong-instance-edit',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './edit.component.html'
})
export class KongInstanceEditComponent extends EditComponent {
  /**实例ID */
  id!: number;
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '实例名称' },
      description: { type: 'string', title: '实例说明' },
      url: { type: 'string', title: '接口地址' },
      status: {
        type: 'boolean',
        title: '启用状态',
        enum: [
          { label: '有效', value: true },
          { label: '禁用', value: false }
        ]
      },
      create: {
        type: 'object',
        properties: { userId: { type: 'number', title: '创建用户' }, at: { type: 'number', title: '创建时间' } }
      },
      update: {
        type: 'object',
        properties: {
          userId: { type: 'number', title: '更新用户' },
          at: { type: 'number', title: '更新时间' },
          operateId: { type: 'number', title: '操作ID' },
          operate: { type: 'string', title: '操作类型' },
          reqId: { type: 'number', title: '请求ID' }
        }
      }
    },
    required: ['name', 'description']
  };

  /**
   * 构造函数
   * @param instanceSrv 实例服务
   */
  constructor(private instanceSrv: KongInstanceService) {
    super();
    this.main = 'kong';
    this.baseUrl = '/kong/instance';
    this.name = '实例';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $status: { widget: 'radio', styleType: 'button', buttonStyle: 'solid', grid: { span: 8 } },
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
    this.show = () => this.instanceSrv.show(this.id);
    this.create = () => this.instanceSrv.create(this.value);
    this.update = () => this.instanceSrv.update(this.id, this.value);
  }

  /**
   * 重写提交方法
   * @param back 是否返回列表页
   */
  override save(back: boolean = true) {
    this.value = this.sf.value;
    super.save(back);
  }
}
