import { Component } from '@angular/core';
import { STColumn, STColumnTag } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { format, fromUnixTime } from 'date-fns';
import { zip } from 'rxjs';

import { KongRouteService, KongServiceService, KongPluginService, KongObjectComponent } from '..';

@Component({
  selector: 'app-kong-plugin',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './plugin.component.html'
})
export class KongPluginComponent extends KongObjectComponent {
  /**新增页面路由 */
  add!: string;
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '名称', index: 'name' },
    { title: '协议', render: 'protocols' },
    { title: '路由', format: item => this.routeSrv.dataMap.get(item.route?.id)?.name || '' },
    { title: '服务', format: item => this.serviceSrv.dataMap.get(item.service?.id)?.name || '' },
    {
      title: '状态',
      index: 'enabled',
      width: 100,
      type: 'tag',
      tag: {
        true: { text: '启用', color: 'green' },
        false: { text: '禁用', color: 'red' }
      } as STColumnTag,
      filter: {
        menus: [
          { value: true, text: '启用', checked: true },
          { value: false, text: '禁用' }
        ],
        multiple: true,
        fn: (filter, record) => filter.value === null || filter.value === record.enabled
      }
    },
    { title: '创建时间', format: item => format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm:ss') },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/kong/plugin/${this.id}/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/kong/plugin/${this.id}/copy/${record.id}` },
        { text: '删除', icon: 'delete', type: 'del', click: record => this.distory(this.id, record.id) }
      ]
    }
  ];

  /**
   * 构造函数
   * @param routeSrv 路由服务
   */
  constructor(
    private pluginSrv: KongPluginService,
    private routeSrv: KongRouteService,
    private serviceSrv: KongServiceService
  ) {
    super();
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      if (this.id) {
        this.loading = true;
        this.pluginSrv.list(this.id, init);
        this.routeSrv.list(this.id, init);
        this.serviceSrv.list(this.id, init);
      }
    };
    zip(this.pluginSrv.dataSub, this.routeSrv.dataSub, this.serviceSrv.dataSub).subscribe(data => {
      this.add = `/kong/plugin/${this.id}/add`;
      this.data = data[0];
      this.loading = false;
    });
  }

  /**
   * 删除
   * @param instance 实例ID
   * @param id 路由ID
   */
  distory(instance: number, id: string) {
    this.loading = true;
    this.routeSrv.distory(instance, id).subscribe(data => {
      console.debug('distory', data);
      this.reload();
      this.loading = false;
    });
  }
}
