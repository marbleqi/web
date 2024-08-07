import { Component } from '@angular/core';
import { STColumn, STData } from '@delon/abc/st';
import { SFSchema, SFUISchema, SFSchemaEnum } from '@delon/form';
import { SHARED_IMPORTS, ListComponent } from '@shared';
import { BehaviorSubject, zip } from 'rxjs';

import { AuthAbilityService, AuthRoleService } from '..';

@Component({
  selector: 'app-auth-ability',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './ability.component.html'
})
export class AuthAbilityComponent extends ListComponent {
  /**模块ID */
  moduleId: number = 0;
  /**对象ID */
  objectId: number = 0;
  /**模块订阅 */
  moduleSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([{ value: 0, label: '所有模块' }]);
  /**对象订阅 */
  objectSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([{ value: 0, label: '所有对象' }]);
  /**过滤条件表单配置 */
  schema: SFSchema = { properties: { module: { type: 'number', title: '模块' }, object: { type: 'number', title: '对象' } } };
  /**过滤条件表单样式 */
  ui: SFUISchema = {
    $module: {
      widget: 'select',
      width: 200,
      change: (value: number) => {
        if (value) {
          this.moduleId = value;
          this.objectId = 0;
          this.data = this.abilities.filter((ability: any) => ability.pid === this.moduleId);
          const data: SFSchemaEnum[] = this.data.map((ability: any) => ({ value: ability.id, label: ability.name }));
          data.unshift({ value: 0, label: '所有对象' });
          this.objectSub.next(data);
        } else {
          this.moduleId = 0;
          this.objectId = 0;
          this.objectSub.next([{ value: 0, label: '所有对象' }]);
          this.data = this.abilities;
        }
      },
      asyncData: () => this.moduleSub.asObservable()
    },
    $object: {
      widget: 'select',
      width: 300,
      change: (value: number) => {
        if (value) {
          this.objectId = value;
          this.data = this.abilities.filter((ability: any) => ability.pid === value);
        } else {
          this.objectId = 0;
          if (this.moduleId) {
            this.data = this.abilities.filter((ability: any) => ability.pid === this.moduleId);
          } else {
            this.data = this.abilities;
          }
        }
      },
      asyncData: () => this.objectSub.asObservable()
    }
  };
  /**表单初始数据 */
  i = { module: 0, object: 0 };
  /**表格列配置 */
  columns: STColumn[] = [
    { title: '权限点ID', index: 'id', sort: { compare: (a, b) => a.id - b.id } },
    { title: '上级权限点ID', index: 'pid' },
    { title: '权限点名称', index: 'name' },
    { title: '权限点说明', index: 'description' },
    {
      title: '权限点类型',
      index: 'type',
      filter: {
        menus: [
          { value: '模块', text: '模块' },
          { value: '对象', text: '对象' },
          { value: '接口', text: '接口' }
        ],
        multiple: true,
        fn: (filter, record) => filter.value === null || record.type === filter.value
      }
    },
    { title: '所属模块', index: 'moduleName' },
    { title: '所属对象', index: 'objectName' },
    {
      title: '授权角色数',
      format: record =>
        Array.from(this.roleSrv.dataMap.values())
          .filter(item => item.abilities.includes(record.id))
          .length.toString()
    },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      buttons: [{ text: '角色授权', icon: 'team', type: 'link', click: record => `auth/ability/role/${record.id}` }]
    }
  ];
  /**全部数据记录 */
  abilities: STData[] = [];

  /**构造函数 */
  constructor(
    private abilitySrv: AuthAbilityService,
    private roleSrv: AuthRoleService
  ) {
    super();
    this.main = 'auth';
    this.columns = this.columns.map((column: STColumn) => ({ ...column, className: 'text-center' }));
    this.reload = (init: boolean = false) => {
      this.loading = true;
      this.abilitySrv.index(init);
      this.roleSrv.index(init);
    };
    zip(this.abilitySrv.dataSub, this.roleSrv.dataSub).subscribe(res => {
      console.debug('返回数据', res);
      const abilities = res[0];
      this.abilities = abilities;
      this.data = abilities;
      const data: SFSchemaEnum[] = abilities
        .filter((ability: any) => ability.pid === 0)
        .map((ability: any) => ({ value: ability.id, label: ability.name }));
      data.unshift({ value: 0, label: '所有模块' });
      this.moduleSub.next(data);
      this.loading = false;
    });
  }
}
