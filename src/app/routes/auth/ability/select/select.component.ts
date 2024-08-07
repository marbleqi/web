import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { STColumn, STData, STChange } from '@delon/abc/st';
import { ArrayService } from '@delon/util';
import { SHARED_IMPORTS } from '@shared';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TransferItem, TransferChange, TransferSelectChange } from 'ng-zorro-antd/transfer';

import { AuthAbilityService } from '../..';

/**控件类型 */
enum controlType {
  /**穿梭框 */
  transfer,
  /**标签 */
  tag,
  /**树 */
  tree,
  /**表格 */
  st
}

/**权限点选择器 */
@Component({
  selector: 'app-auth-ability-select',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './select.component.html'
})
export class AuthAbilitySelectComponent implements OnInit {
  /**是否加载中 */
  loading: boolean = true;
  /**所有权限点 */
  allData: any[] = [];
  /**已授权权限点 */
  selectedData: number[] = [];
  /**左侧已选中权限点 */
  leftCheckedData: number[] = [];
  /**右侧已选中权限点 */
  rightCheckedData: number[] = [];
  /**传入的预设权限点 */
  @Input() set abilities(abilities: number[]) {
    if (typeof abilities === 'object') {
      this.selectedData = abilities.sort((a: number, b: number) => a - b);
    }
  }
  /**权限点改变事件 */
  @Output() readonly nzChange = new EventEmitter<number[]>();
  /**穿梭框数据 */
  tranData: TransferItem[] = [];
  /**标签数据 */
  tagData: any[] = [];
  /**树控件数据 */
  treeData: NzTreeNodeOptions[] = [];
  /**表格列配置 */
  columns: STColumn[] = [
    { type: 'checkbox' },
    { title: '权限点名称', index: 'name' },
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
    { title: '所属对象', index: 'objectName' }
  ];
  /**表格数据 */
  stData: STData[] = [];

  /**
   * 构造函数
   * @param arraySrv 数组服务
   * @param abilitySrv 权限点服务
   */
  constructor(
    private arraySrv: ArrayService,
    private abilitySrv: AuthAbilityService
  ) {
    this.abilitySrv.dataSub.subscribe({
      next: res => {
        this.allData = res.sort((a: any, b: any) => a.id - b.id);
        this.refresh(controlType.transfer, controlType.tree, controlType.st);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('加载报错', err);
      }
    });
  }

  /**组件初始化 */
  ngOnInit(): void {
    this.abilitySrv.index();
  }

  /**
   * 关闭已选中标签
   * @param id 权限点ID
   */
  close(id: number): void {
    this.leftCheckedData = this.leftCheckedData.filter(item => item !== id).sort((a: number, b: number) => a - b);
    this.refresh(controlType.transfer, controlType.tree);
  }

  /**
   * 树节点选中事件
   * @param event 树节点选中事件对象
   */
  treeCheckBoxChange(event: NzFormatEmitEvent): void {
    console.debug('treeCheckBoxChange', event);
    this.leftCheckedData =
      event.nodes
        ?.filter(item => !item.origin.disabled)
        .map(item => item.origin['id'])
        .sort((a: number, b: number) => a - b) || [];
    this.refresh(controlType.transfer, controlType.tag);
  }

  /**
   * 表格选中事件
   * @param ret 表格选中事件对象
   */
  stChange(ret: STChange): void {
    if (ret.type === 'checkbox') {
      this.rightCheckedData = ret.checkbox?.map(item => item.id).sort((a: number, b: number) => a - b) || [];
      this.refresh(controlType.transfer);
    }
  }

  /**
   * 穿梭框选中事件
   * @param ret 穿梭框选中改变对象
   */
  select(ret: TransferSelectChange): void {
    if (ret.direction === 'left') {
      this.leftCheckedData = ret.list.map(item => item['id']).sort((a: number, b: number) => a - b);
    } else {
      this.rightCheckedData = ret.list.map(item => item['id']).sort((a: number, b: number) => a - b);
    }
    this.refresh(controlType.tag, controlType.tree, controlType.st);
  }

  /**
   * 穿梭框改变事件
   * @param ret 穿梭框改变对象
   */
  change(ret: TransferChange): void {
    if (ret.from === 'left') {
      this.leftCheckedData = [];
      this.selectedData = this.selectedData.concat(ret.list.map(item => item['id'])).sort((a: number, b: number) => a - b);
    } else {
      this.rightCheckedData = [];
      this.selectedData = this.selectedData
        .filter(item => !ret.list.map(item => item['id']).includes(item))
        .sort((a: number, b: number) => a - b);
    }
    this.refresh(controlType.tag, controlType.tree, controlType.st);
    this.nzChange.emit(this.selectedData);
  }

  /**
   * 刷新控件
   * @param type 控件类型
   */
  refresh(...type: controlType[]): void {
    if (type.includes(controlType.transfer)) {
      this.tranData = this.allData
        .map(
          item =>
            ({
              ...item,
              title: `${item.name}（${item.type}）`,
              direction: this.selectedData.includes(item.id) ? 'right' : 'left',
              checked: this.leftCheckedData.includes(item.id) || this.rightCheckedData.includes(item.id)
            }) as TransferItem
        )
        .sort((a: TransferItem, b: TransferItem) => a['id'] - b['id']);
    }
    if (type.includes(controlType.tag)) {
      this.tagData = this.allData.filter(item => this.leftCheckedData.includes(item.id)).sort((a: any, b: any) => a.id - b.id);
    }
    if (type.includes(controlType.tree)) {
      this.treeData = this.arraySrv.arrToTree(
        this.allData
          .map(
            item =>
              ({
                ...item,
                title: `${item.name}（${item.type}）`,
                key: String(item.id),
                pid: String(item.pid),
                isLeaf: item.type === '接口',
                disabled: this.selectedData.includes(item.id),
                checked: this.selectedData.includes(item.id) || this.leftCheckedData.includes(item.id),
                expanded: item.type !== '接口',
                selectable: false
              }) as NzTreeNodeOptions
          )
          .sort((a: NzTreeNodeOptions, b: NzTreeNodeOptions) => a['id'] - b['id']),
        { idMapName: 'key', parentIdMapName: 'pid' }
      );
    }
    if (type.includes(controlType.st)) {
      this.stData = this.allData
        .filter(item => this.selectedData.includes(item.id))
        .map(item => ({ ...item, checked: this.rightCheckedData.includes(item.id) }))
        .sort((a: any, b: any) => a.id - b.id);
    }
  }
}
