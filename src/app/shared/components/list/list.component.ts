import { Component } from '@angular/core';
import { STData, STChange } from '@delon/abc/st';
import { BaseComponent } from '@shared';

/**通用列表组件 */
@Component({
  selector: 'app-list',
  standalone: true,
  template: ''
})
export class ListComponent extends BaseComponent {
  /**表格数据 */
  data: STData[] = [];
  /**已选中数据 */
  protected checked: STData[] = [];
  /**批量操作按钮的可用状态Map */
  protected enableMap: Map<string, boolean> = new Map<string, boolean>();

  /**可用状态Map刷新，可重写 */
  enable() {
    this.enableMap.set(
      'enable',
      this.checked.every(item => !item['status'])
    );
    this.enableMap.set(
      'disable',
      this.checked.every(item => item['status'])
    );
  }

  /**表格变动事件 */
  change(e: STChange) {
    console.debug(e);
    if (e.type === 'checkbox') {
      if (e.checkbox && e.checkbox.length) {
        this.checked = e.checkbox;
        this.enable();
      } else {
        this.checked = [];
        this.enableMap.clear();
      }
    }
  }

  /**获取批量操作按钮禁用状态 */
  disable(button: string): boolean {
    return !this.enableMap.get(button);
  }
}
