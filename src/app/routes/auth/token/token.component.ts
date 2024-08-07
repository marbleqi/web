import { Component } from '@angular/core';
import { STColumn, STData } from '@delon/abc/st';
import { SHARED_IMPORTS, ListComponent } from '@shared';

import { AuthTokenService } from '..';

@Component({
  selector: 'app-auth-token',
  standalone: true,
  imports: [...SHARED_IMPORTS, ListComponent],
  templateUrl: './token.component.html'
})
export class AuthTokenComponent extends ListComponent {
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '令牌', index: 'token', width: 350 },
    { title: '用户', type: 'widget', widget: { type: 'user', params: ({ record }) => ({ id: Number(record.id) }) } },
    { title: '创建时间', index: 'createAt', type: 'date', dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS', width: 200 },
    { title: '更新时间', index: 'updateAt', type: 'date', dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS', width: 200 },
    { title: '过期时间', index: 'expired', type: 'date', dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS', width: 200 },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [{ text: '作废', icon: 'delete', type: 'del', click: record => this.remove(record) }]
    }
  ];

  /**
   * 构造函数
   * @param tokenSrv 令牌服务
   */
  constructor(private tokenSrv: AuthTokenService) {
    super();
    this.main = 'auth';
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = () => {
      this.loading = true;
      this.tokenSrv.index();
    };
    this.tokenSrv.dataSub.subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

  /**
   * 作废令牌
   * @param record 删除的令牌
   */
  remove(record?: STData): void {
    this.loading = true;
    if (record) {
      this.checked = [record];
    }
    const total = this.checked.length;
    let i = 0;
    this.checked.forEach((item: any) => {
      this.tokenSrv.destroy(item['token']).subscribe(res => {
        // if (res.code) {
        //   this.messageService.warning(`删除令牌${item['token']}失败`);
        // } else {
        //   this.messageService.success(`删除令牌${item['token']}成功`);
        // }
        i++;
        if (total === i) {
          this.reload();
        }
      });
    });
  }
}
