import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { STColumn, STColumnTag } from '@delon/abc/st';
import { SHARED_IMPORTS, ListComponent } from '@shared';
import { zip } from 'rxjs';

import { AuthRoleService, AuthUserService } from '..';

@Component({
  selector: 'app-auth-role',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './role.component.html'
})
export class AuthRoleComponent extends ListComponent {
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '角色ID', index: 'id', sort: { compare: (a, b) => a.id - b.id } },
    {
      title: '角色名称',
      index: 'name',
      sort: { compare: (a, b) => a.config.text.localeCompare(b.config.text) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.config.text.includes(filter.value) }
    },
    {
      title: '角色说明',
      index: 'description',
      width: 200,
      sort: { compare: (a, b) => a.config.description.localeCompare(b.config.description) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.config.description.includes(filter.value) }
    },
    {
      title: '权限数',
      format: record => record.abilities.length.toString()
    },
    {
      title: '授权用户数',
      format: record =>
        Array.from(this.userSrv.dataMap.values())
          .filter(user => user.roles.includes(record.id))
          .length.toString()
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
      type: 'tag',
      tag: {
        true: { text: '有效', color: 'green' },
        false: { text: '禁用', color: 'red' }
      } as STColumnTag,
      filter: {
        menus: [
          { value: true, text: '有效', checked: true },
          { value: false, text: '禁用' }
        ],
        multiple: true,
        fn: (filter, record) => filter.value === null || filter.value === record.status
      }
    },
    { title: '更新人', type: 'widget', widget: { type: 'user', params: ({ record }) => ({ id: Number(record?.update?.userId) }) } },
    {
      title: '更新时间',
      index: 'update.at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
      width: 200,
      sort: { compare: (a, b) => a.updateAt - b.updateAt }
    },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `auth/role/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `auth/role/copy/${record.id}` },
        { text: '授权', icon: 'user', type: 'link', click: record => `auth/role/grant/${record.id}` }
      ]
    }
  ];
  constructor(
    private roleSrv: AuthRoleService,
    private userSrv: AuthUserService
  ) {
    super();
    this.main = 'auth';
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      this.loading = true;
      this.roleSrv.index(init);
      this.userSrv.index(init);
    };
    zip(this.roleSrv.dataSub, this.userSrv.dataSub).subscribe({
      next: res => {
        console.debug('返回数据', res);
        this.data = res[0];
        console.debug('角色显示数据', this.data);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('加载报错', err);
      }
    });
  }

  /**批量设置用户状态 */
  status(status: boolean) {
    this.loading = true;
    this.roleSrv
      .status(
        this.checked.map(item => item['id']),
        status
      )
      .subscribe(() => {
        this.checked = [];
        this.enableMap.clear();
        this.reload();
      });
  }
}
