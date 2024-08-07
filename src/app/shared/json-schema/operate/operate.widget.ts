import { Component } from '@angular/core';
import { ControlWidget } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

/**表单操作类型小部件 */
@Component({
  selector: 'sf-widget-operate',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './operate.widget.html'
})
export class OperateWidget extends ControlWidget {
  /**小部件key */
  static readonly KEY = 'operate';
  /**操作类型 */
  operate!: string;

  /**重写数据重置事件 */
  override reset(value: string) {
    super.reset(value);
    switch (value) {
      case 'create':
        this.operate = '新增';
        break;
      case 'update':
        this.operate = '修改';
        break;
      case 'status':
        this.operate = '状态变更';
        break;
      default:
        this.operate = '未定义';
    }
  }
}
