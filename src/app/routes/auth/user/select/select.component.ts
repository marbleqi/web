import { Component, ViewChild, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzTransferComponent, TransferItem, TransferChange } from 'ng-zorro-antd/transfer';

import { AuthUserService } from '../..';

@Component({
  selector: 'app-auth-user-select',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './select.component.html'
})
export class AuthUserSelectComponent implements OnInit {
  /**是否加载中 */
  loading: boolean = true;
  /**所有用户 */
  allData: any[] = [];
  /**已授权用户ID */
  selectedData: number[] = [];
  style: NgStyleInterface = { width: '100%' };
  /**传入的已选用户ID */
  @Input() users!: number[];
  /**传入的角色ID */
  @Input() role!: number;
  /**菜单改变事件 */
  @Output() readonly selectChange = new EventEmitter<number[]>();
  /**穿梭框 */
  // @ViewChild('tc') readonly tc!: NzTransferComponent;

  /**穿梭框数据 */
  tranData: TransferItem[] = [];

  constructor(private userSrv: AuthUserService) {
    this.userSrv.dataSub.subscribe(res => {
      this.allData = res.sort((a: any, b: any) => a.id - b.id);
      if (this.role) {
        this.selectedData = this.allData.filter(item => item.roles.includes(this.role)).map(item => item.id);
      } else {
        this.selectedData = this.users || [];
      }
      this.selectChange.emit(this.selectedData);
      this.tranData = this.allData
        .map(
          item =>
            ({
              ...item,
              title: `${item.name}`,
              direction: this.selectedData.includes(item.id) ? 'right' : 'left'
            }) as TransferItem
        )
        .sort((a: TransferItem, b: TransferItem) => a['id'] - b['id']);
      this.loading = false;
    });
  }

  ngOnInit(): void {
    console.debug('role', this.role);
    this.userSrv.index();
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
