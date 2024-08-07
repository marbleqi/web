import { Component } from '@angular/core';
import { SFSchema, SFSchemaEnum } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { BehaviorSubject } from 'rxjs';

import { KongServiceService, KongObjectEditComponent } from '../..';

@Component({
  selector: 'app-kong-service-edit',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './edit.component.html'
})
export class KongServiceEditComponent extends KongObjectEditComponent {
  /**上游选项订阅 */
  upstreamSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([]);
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'id' },
      name: { type: 'string', title: '名称' },
      protocol: {
        type: 'string',
        title: '协议',
        enum: ['http', 'https', 'grpc', 'grpcs', 'tcp', 'tls', 'tls_passthrough', 'udp', 'ws', 'wss']
      },
      host: { type: 'string', title: '地址' },
      port: { type: 'number', title: '端口' },
      path: { type: 'string', title: '路径' },
      connect_timeout: { type: 'number', title: '连接超时' },
      read_timeout: { type: 'number', title: '读超时' },
      write_timeout: { type: 'number', title: '写超时' },
      enabled: { type: 'boolean', title: '启用' },
      created_at: { type: 'number', title: '创建时间', timestamp: 's' },
      updated_at: { type: 'number', title: '更新时间', timestamp: 's' }
    },
    required: []
  };

  constructor(private serviceSrv: KongServiceService) {
    super();
    this.main = 'kong';
    this.baseUrl = '/kong/list/service';
    this.name = '服务';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $connect_timeout: { grid: { span: 6 } },
      $read_timeout: { grid: { span: 6 } },
      $write_timeout: { grid: { span: 6 } },
      $enabled: { grid: { span: 6 } },
      $created_at: { widget: 'at' },
      $updated_at: { widget: 'at' }
    };
    this.serviceSrv.dataSub.subscribe((data: any[]) => {
      this.upstreamSub.next(data.map((item: any) => ({ label: item.name, value: item.id })));
    });
    this.show = () => this.serviceSrv.get(this.instance, this.id as string);
    this.create = () => this.serviceSrv.create(this.instance, this.value);
    this.update = () => this.serviceSrv.update(this.instance, this.id as string, this.value);
  }

  override init(record: any) {
    this.serviceSrv.list(this.instance);
    this.i = record || {};
    this.value = this.i;
    console.debug('init', record, this.i);
  }

  /**
   * 重写提交方法
   * @param back 是否返回列表页
   */
  override save(back: boolean = true) {
    console.debug('service', this.value);
    this.value = {
      ...this.value,
      id: undefined,
      created_at: undefined,
      updated_at: undefined
    };
    super.save(back);
  }
}
