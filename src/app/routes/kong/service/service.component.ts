import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { format, fromUnixTime } from 'date-fns';

import { KongServiceService, KongObjectComponent } from '..';

@Component({
  selector: 'app-kong-service',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './service.component.html'
})
export class KongServiceComponent extends KongObjectComponent {
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
    { title: '协议', index: 'protocol' },
    { title: '地址', index: 'host', sort: { compare: (a, b) => a.host.localeCompare(b.host) } },
    { title: '端口', index: 'port' },
    { title: '路径', index: 'path' },
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
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/kong/service/${this.id}/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/kong/service/${this.id}/copy/${record.id}` },
        { text: '删除', icon: 'delete', type: 'del', click: record => this.distory(record.id) }
      ]
    }
  ];

  /**
   * 构造函数
   * @param serviceSrv 服务服务
   */
  constructor(private serviceSrv: KongServiceService) {
    super();
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      console.debug('reuse', this.reuseSrv);
      if (this.id) {
        this.loading = true;
        this.serviceSrv.list(this.id, init);
      } else {
        this.loading = false;
      }
    };
    this.serviceSrv.dataSub.subscribe(data => {
      this.add = `/kong/service/${this.id}/add`;
      this.data = data;
      this.loading = false;
    });
  }

  /**
   * 删除
   * @param instance 实例ID
   * @param id 路由ID
   */
  distory(id?: string) {
    this.loading = true;
    const params: string[] = id ? [id] : this.checked.map(item => item['id']);
    const tatal = params.length;
    let i = 0;
    params.forEach(id => {
      this.serviceSrv.distory(this.id, id).subscribe({
        next: res => {
          console.debug('服务删除成功', res);
          i++;
          console.debug('服务删除成功i', i);
          if (i === tatal) {
            this.reload();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.debug('服务删除报错', err);
          this.message.error(err.error.message);
          i++;
          console.debug('服务删除报错i', i);
          if (i === tatal) {
            this.reload();
          }
        }
      });
    });
  }
}
