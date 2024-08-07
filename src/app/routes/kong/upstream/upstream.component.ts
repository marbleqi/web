import { Component } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { format, fromUnixTime } from 'date-fns';

import { KongUpstreamService, KongObjectComponent } from '..';

@Component({
  selector: 'app-kong-upstream',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './upstream.component.html'
})
export class KongUpstreamComponent extends KongObjectComponent {
  /**新增页面路由 */
  add!: string;
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '名称', index: 'name' },
    { title: '创建时间', format: item => format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm:ss') },
    { title: '更新时间', format: item => format(fromUnixTime(item.updated_at), 'yyyy-MM-dd HH:mm:ss') },

    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/kong/service/${this.id}/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/kong/service/${this.id}/copy/${record.id}` },
        { text: '删除', icon: 'delete', type: 'del', click: record => this.distory(this.id, record.id) }
      ]
    }
  ];

  /**
   * 构造函数
   * @param upstreamSrv 上游服务
   */
  constructor(private upstreamSrv: KongUpstreamService) {
    super();
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      if (this.id) {
        this.loading = true;
        this.upstreamSrv.list(this.id, init);
      } else {
        this.loading = false;
      }
    };
    this.upstreamSrv.dataSub.subscribe(data => {
      this.add = `/kong/upstream/${this.id}/add`;
      this.data = data;
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
    this.upstreamSrv.distory(instance, id).subscribe(data => {
      console.debug('distory', data);
      this.reload();
      this.loading = false;
    });
  }
}
