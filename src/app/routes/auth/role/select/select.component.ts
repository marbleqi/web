import { Component, ViewChild, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzTransferComponent, TransferItem, TransferChange } from 'ng-zorro-antd/transfer';

import { AuthRoleService } from '../..';

@Component({
  selector: 'app-auth-role-select',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './select.component.html'
})
export class AuthRoleSelectComponent implements OnInit {
  /**是否加载中 */
  loading: boolean = true;
  /**所有角色 */
  allData: any[] = [];
  /**已授权角色ID */
  selectedData: number[] = [];
  style: NgStyleInterface = { width: '100%' };
  /**传入的已选角色ID */
  @Input() roles!: number[];
  /**传入的权限点ID */
  @Input() ability!: number;
  /**菜单改变事件 */
  @Output() readonly selectChange = new EventEmitter<number[]>();
  /**穿梭框 */
  @ViewChild('tc') readonly tc!: NzTransferComponent;

  /**穿梭框数据 */
  tranData: TransferItem[] = [];

  constructor(private roleSrv: AuthRoleService) {
    this.roleSrv.dataSub.subscribe(res => {
      this.allData = res.sort((a: any, b: any) => a.id - b.id);
      if (this.ability) {
        this.selectedData = this.allData.filter(item => item.abilities.includes(this.ability)).map(item => item.id);
      } else {
        this.selectedData = this.roles || [];
      }
      this.selectChange.emit(this.selectedData);
      this.tranData = this.allData
        .map(
          item =>
            ({
              ...item,
              title: `${item.name}（${item.description}）`,
              direction: this.selectedData.includes(item.id) ? 'right' : 'left'
            }) as TransferItem
        )
        .sort((a: TransferItem, b: TransferItem) => a['id'] - b['id']);
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.roleSrv.index();
  }

  /**
   * 穿梭框改变事件
   * @param ret 穿梭框改变对象
   */
  change(ret: TransferChange): void {
    if (ret.from === 'left') {
      this.selectedData = this.selectedData.concat(ret.list.map(item => item['id'])).sort((a: number, b: number) => a - b);
    } else {
      this.selectedData = this.selectedData
        .filter(item => !ret.list.map(item => item['id']).includes(item))
        .sort((a: number, b: number) => a - b);
    }
    this.selectChange.emit(this.selectedData);
  }
}
