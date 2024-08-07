import { Component } from '@angular/core';
import { STColumn, STColumnTag } from '@delon/abc/st';
import { SHARED_IMPORTS, ListComponent } from '@shared';

import { KongInstanceService } from '..';

/**KONG实例列表组件 */
@Component({
  selector: 'app-kong-instance',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './instance.component.html'
})
export class KongInstanceComponent extends ListComponent {
  /**表格配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '实例ID', index: 'id' },
    { title: '实例名称', index: 'name' },
    { title: '实例说明', index: 'description' },
    { title: '接口地址', index: 'url' },
    {
      title: '状态',
      index: 'status',
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
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [
        { text: '编辑', icon: 'edit', type: 'link', click: record => `/kong/instance/edit/${record.id}` },
        { text: '克隆', icon: 'copy', type: 'link', click: record => `/kong/instance/copy/${record.id}` }
      ]
    }
  ];

  constructor(private instanceSrv: KongInstanceService) {
    super();
    this.main = 'kong';
    this.columns = this.columns.map((item: STColumn) => ({ ...item, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      this.loading = true;
      this.instanceSrv.index(init);
    };
    this.instanceSrv.dataSub.subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

  /**批量设置用户状态 */
  status(status: boolean) {
    this.loading = true;
    this.instanceSrv
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
