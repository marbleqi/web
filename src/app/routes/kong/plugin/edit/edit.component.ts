import { Component } from '@angular/core';
import { SFSchema, SFSchemaEnum } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { BehaviorSubject } from 'rxjs';

import {
  KongRouteService,
  KongServiceService,
  KongPluginService,
  KongObjectEditComponent,
  KongPluginSelectComponent,
  KongPluginCorsComponent,
  KongPluginHttpLogComponent,
  KongPluginRedirectComponent,
  KongPluginResponseTransformerComponent
} from '../..';

@Component({
  selector: 'app-kong-plugin-edit',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    KongPluginSelectComponent,
    KongPluginCorsComponent,
    KongPluginHttpLogComponent,
    KongPluginRedirectComponent,
    KongPluginResponseTransformerComponent
  ],
  templateUrl: './edit.component.html'
})
export class KongPluginEditComponent extends KongObjectEditComponent {
  /**插件名称 */
  plugin!: string;
  /**路由选项订阅 */
  routeSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([]);
  /**服务选项订阅 */
  serviceSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([]);
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'id' },
      name: { type: 'string', title: '插件' },
      protocols: {
        type: 'string',
        title: '协议',
        default: ['http'],
        enum: [
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' }
        ]
      },
      enabled: { type: 'boolean', title: '状态', default: true },
      route: { type: 'object', properties: { id: { type: 'string', title: '路由' } } },
      service: { type: 'object', properties: { id: { type: 'string', title: '服务' } } },
      created_at: { type: 'number', title: '创建时间', timestamp: 's' }
    }
  };
  /**插件配置 */
  config: any = {};

  constructor(
    private pluginSrv: KongPluginService,
    private routeSrv: KongRouteService,
    private serviceSrv: KongServiceService
  ) {
    super();
    this.main = 'kong';
    this.baseUrl = '/kong/list/plugin';
    this.name = '插件';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $name: { widget: 'custom', grid: { span: 24 } },
      $protocols: { widget: 'select', mode: 'multiple', grid: { span: 6 } },
      $enabled: { grid: { span: 6 } },
      $route: { grid: { span: 6 }, $id: { widget: 'select', grid: { span: 24 }, asyncData: () => this.routeSub } },
      $service: { grid: { span: 6 }, $id: { widget: 'select', grid: { span: 24 }, asyncData: () => this.serviceSub } },
      $created_at: { widget: 'at' }
    };
    this.routeSrv.dataSub.subscribe((data: any[]) => {
      this.routeSub.next(data.map((item: any) => ({ label: item.name, value: item.id })));
    });
    this.serviceSrv.dataSub.subscribe((data: any[]) => {
      this.serviceSub.next(data.map((item: any) => ({ label: item.name, value: item.id })));
    });
    this.show = () => this.pluginSrv.get(this.instance, this.id as string);
    this.create = () => this.pluginSrv.create(this.instance, this.value);
    this.update = () => this.pluginSrv.update(this.instance, this.id as string, this.value);
  }
  override init(record: any) {
    this.routeSrv.list(this.instance);
    this.serviceSrv.list(this.instance);
    if (record) {
      this.i = record;
      this.plugin = record.name;
      this.config = record?.config ? record.config : {};
    } else {
      this.i = {};
    }
    console.debug('init', record, this.i);
  }

  /**
   * 重写提交方法
   * @param back 是否返回列表页
   */
  override save(back: boolean = true) {
    this.value = { ...this.value, id: undefined, created_at: undefined };
    console.debug('back', back, this.value, this.plugin, this.config);
    // super.save(back);
  }

  check(value: any) {
    this.value = { config: value };
    console.debug('check', value);
  }
}
