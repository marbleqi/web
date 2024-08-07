import { Component } from '@angular/core';
import { SFSchema, SFSchemaEnum } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { BehaviorSubject } from 'rxjs';

import { KongRouteService, KongServiceService, KongObjectEditComponent } from '../..';

@Component({
  selector: 'app-kong-route-edit',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './edit.component.html'
})
export class KongRouteEditComponent extends KongObjectEditComponent {
  /**服务选项订阅 */
  serviceSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([]);
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'id' },
      name: { type: 'string', title: '名称' },
      methods: {
        type: 'string',
        title: '方法',
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE']
      },
      protocols: { type: 'string', title: '协议', enum: ['http', 'https'] },
      path_handling: { type: 'string', title: '路径处理规则', default: 'v0', enum: ['v0', 'v1'] },
      strip_path: { type: 'boolean', title: '路径去除' },
      preserve_host: { type: 'boolean', title: '域名透传' },
      request_buffering: { type: 'boolean', title: '请求缓冲' },
      response_buffering: { type: 'boolean', title: '响应缓冲' },
      hosts: { type: 'string', title: '域名', min: 1, max: 50 },
      paths: { type: 'string', title: '路径', min: 1, max: 50 },
      service: { type: 'object', properties: { id: { type: 'string', title: '服务' } } },
      created_at: { type: 'number', title: '创建时间', timestamp: 's' },
      updated_at: { type: 'number', title: '更新时间', timestamp: 's' }
    }
  };

  constructor(
    private routeSrv: KongRouteService,
    private serviceSrv: KongServiceService
  ) {
    super();
    this.main = 'kong';
    this.baseUrl = '/kong/list/route';
    this.name = '路由';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $methods: { widget: 'select', mode: 'multiple' },
      $protocols: { widget: 'select', mode: 'multiple', grid: { span: 4 } },
      $path_handling: { widget: 'select', grid: { span: 4 } },
      $strip_path: { grid: { span: 4 } },
      $preserve_host: { grid: { span: 4 } },
      $request_buffering: { grid: { span: 4 } },
      $response_buffering: { grid: { span: 4 } },
      $hosts: { widget: 'list' },
      $paths: { widget: 'list' },
      $service: { $id: { widget: 'select', asyncData: () => this.serviceSub }, grid: { span: 24 } },
      $created_at: { widget: 'at' },
      $updated_at: { widget: 'at' }
    };
    this.serviceSrv.dataSub.subscribe((data: any[]) => {
      this.serviceSub.next(data.map((item: any) => ({ label: item.name, value: item.id })));
    });
    this.show = () => this.routeSrv.get(this.instance, this.id as string);
    this.create = () => this.routeSrv.create(this.instance, this.value);
    this.update = () => this.routeSrv.update(this.instance, this.id as string, this.value);
  }

  override init(record: any) {
    this.serviceSrv.list(this.instance);
    if (record) {
      this.i = record;
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
    this.value = { ...this.value, id: undefined, tag: undefined, headers: undefined, created_at: undefined, updated_at: undefined };
    super.save(back);
  }
}
