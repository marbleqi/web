import { Component } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { format, fromUnixTime } from 'date-fns';
import { zip } from 'rxjs';

import { KongRouteService, KongServiceService, KongObjectComponent } from '..';

@Component({
  selector: 'app-kong-route',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './route.component.html'
})
export class KongRouteComponent extends KongObjectComponent {
  /**新增页面路由 */
  add!: string;
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    {
      title: '名称',
      index: 'name',
      // sort: { compare: (a, b) => a.name.localeCompare(b.name) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.name.includes(filter.value) }
    },
    {
      title: '服务',
      type: 'link',
      index: 'service_name',
      // sort: { compare: (a, b) => a.service_name.localeCompare(b.service_name) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.service_name.includes(filter.value) },
      click: record => {
        if (record?.service?.id) {
          return `/kong/service/${this.id}/edit/${record.service.id}`;
        } else {
          return undefined;
        }
      }
    },
    { title: '域名', render: 'hosts' },
    { title: '路径', render: 'paths' },
    { title: '协议', render: 'protocols' },
    { title: '创建时间', format: item => format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm:ss') },
    {
      title: '更新时间',
      format: item => format(fromUnixTime(item.updated_at), 'yyyy-MM-dd HH:mm:ss'),
      sort: { compare: (a, b) => a.updated_at - b.updated_at }
    },

    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/kong/route/${this.id}/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/kong/route/${this.id}/copy/${record.id}` },
        { text: '删除', icon: 'delete', type: 'del', click: record => this.distory(this.id, record.id) }
      ]
    }
  ];

  /**
   * 构造函数
   * @param routeSrv 路由服务
   */
  constructor(
    private routeSrv: KongRouteService,
    private serviceSrv: KongServiceService
  ) {
    super();
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      console.debug('reuse', this.reuseSrv);
      if (this.id) {
        this.loading = true;
        this.routeSrv.list(this.id, init);
        this.serviceSrv.list(this.id, init);
      }
    };
    zip(this.routeSrv.dataSub, this.serviceSrv.dataSub).subscribe(data => {
      this.add = `/kong/route/${this.id}/add`;
      this.data = data[0].map(item => ({ ...item, service_name: this.serviceSrv.dataMap.get(item?.service?.id)?.name ?? '未定义' }));
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
