import { Component } from '@angular/core';
import { STColumn, STColumnTag, STChange } from '@delon/abc/st';
import { SHARED_IMPORTS, ListComponent } from '@shared';

import { AuthUserService } from './user.service';

@Component({
  selector: 'app-auth-user',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './user.component.html'
})
export class AuthUserComponent extends ListComponent {
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '用户ID', index: 'id', sort: { compare: (a, b) => a.id - b.id } },
    {
      title: '登陆名',
      index: 'loginName',
      sort: { compare: (a, b) => a.loginName.localeCompare(b.loginName) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.loginName.includes(filter.value) }
    },
    {
      title: '姓名',
      index: 'name',
      sort: { compare: (a, b) => a.name.localeCompare(b.name) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.name.includes(filter.value) }
    },
    {
      title: '电子邮箱',
      index: 'email',
      width: 200,
      sort: { compare: (a, b) => a.email.localeCompare(b.email) },
      filter: { type: 'keyword', fn: (filter, record) => !filter.value || record.email.includes(filter.value) }
    },
    { title: '锁定', type: 'yn', index: 'locked' },
    {
      title: '角色数',
      format: record => record.roles.length.toString()
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
      sort: { compare: (a, b) => a.update.at - b.update.at }
    },
    { title: '更新序号', index: 'update.operateId' },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/auth/user/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/auth/user/copy/${record.id}` },
        {
          text: '解锁',
          icon: 'unlock',
          iif: item => item.locked,
          click: record =>
            this.userSrv.unlock(record.id).subscribe(() => {
              this.reload();
            })
        },
        {
          text: '更多',
          children: [
            { text: '变更日志', icon: 'history', type: 'link', click: record => `/auth/user/log/${record.id}` },
            { text: '重置密码', icon: 'key', type: 'link', click: record => `/auth/user/resetpsw/${record.id}` }
          ]
        }
      ]
    }
  ];

  /**
   * 构造函数
   * @param userSrv 用户服务
   */
  constructor(private userSrv: AuthUserService) {
    super();
    this.main = 'auth';
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      this.loading = true;
      this.userSrv.index(init);
    };
    this.userSrv.dataSub.subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

  /**批量设置用户状态 */
  status(status: boolean) {
    this.userSrv
      .status(
        this.checked.map(item => item['id']),
        status
      )
      .subscribe(() => {
        this.reload();
      });
  }

  unlock() {
    this.userSrv.unlock(...this.checked.map(item => item['id'])).subscribe(() => {
      this.reload();
    });
  }
}
