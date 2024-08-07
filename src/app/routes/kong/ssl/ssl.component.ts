import { Component } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { format, fromUnixTime } from 'date-fns';

import { KongSslService, KongObjectComponent } from '..';

@Component({
  selector: 'app-kong-ssl',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './ssl.component.html'
})
export class KongSslComponent extends KongObjectComponent {
  /**新增页面路由 */
  add!: string;
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '域名', render: 'snis' },
    {
      title: '生效时间',
      format: item => format(fromUnixTime(item.validity_start), 'yyyy-MM-dd HH:mm:ss'),
      sort: { compare: (a, b) => a.validity_start - b.validity_start }
    },
    {
      title: '过期时间',
      format: item => format(fromUnixTime(item.validity_end), 'yyyy-MM-dd HH:mm:ss'),
      sort: { compare: (a, b) => a.validity_end - b.validity_end }
    },
    {
      title: '创建时间',
      format: item => format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm:ss'),
      sort: { compare: (a, b) => a.created_at - b.created_at }
    },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/kong/ssl/${this.id}/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/kong/ssl/${this.id}/copy/${record.id}` },
        { text: '删除', icon: 'delete', type: 'del', click: record => this.distory([record.id]) }
      ]
    }
  ];

  /**
   * 构造函数
   * @param sslSrv 路由服务
   */
  constructor(private sslSrv: KongSslService) {
    super();
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      if (this.id) {
        this.loading = true;
        this.sslSrv.list(this.id, init);
      }
    };
    this.sslSrv.dataSub.subscribe(data => {
      this.add = `/kong/ssl/${this.id}/add`;
      this.data = data.map(item => ({
        ...item,
        ...this.sslSrv.validity(item.cert)
      }));
      this.loading = false;
    });
  }

  /**
   * 删除
   * @param instance 实例ID
   * @param id 路由ID
   */
  distory(ids: string[] = []) {
    if (ids.length === 0 && this.checked.length > 0) {
      ids = this.checked.map((item: any) => item.id);
    }
    this.loading = true;
    let i = 0;
    for (const id of ids) {
      this.sslSrv.distory(this.id, id).subscribe(data => {
        console.debug('distory', data);
        if (++i === ids.length) {
          this.reload();
          this.loading = false;
        }
      });
    }
  }
}
