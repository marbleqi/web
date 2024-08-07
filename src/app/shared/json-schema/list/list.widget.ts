import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

/**表单字符串数组小部件 */
@Component({
  selector: 'sf-widget-list',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './list.widget.html'
})
export class ListWidget extends ControlWidget implements OnInit {
  /**小部件key */
  static readonly KEY = 'list';
  /**字符串数组 */
  data: string[] = [];
  /**数组元素数量下限 */
  min: number = 1;
  /**数组元素数量上限 */
  max: number = 200;

  /**组件初始化 */
  ngOnInit(): void {
    if (typeof this.schema?.['min'] === 'number') {
      this.min = this.schema['min'];
    }
    if (typeof this.schema?.['max'] === 'number') {
      this.max = this.schema['max'];
    }
  }

  /**重写数据重置事件 */
  override reset(value: string[]) {
    super.reset(value);
    if (value) {
      this.data = value;
    }
  }
  /**
   * 文本框变更事件
   * @param index 文本框序号
   * @param value 文本框值
   */
  change(index: number, value: any) {
    this.data[index] = value;
    this.setValue(this.data);
  }

  /**新建文本框 */
  add() {
    this.data.push('');
  }

  /**
   * 插入文本框
   * @param index 文本框序号
   */
  insert(index: number) {
    this.data.splice(index, 0, '');
  }

  /**
   * 复制文本框
   * @param index 文本框序号
   */
  copy(index: number) {
    const item = this.data[index];
    this.data.push(item);
  }

  /**
   * 删除文本框
   * @param index 文本框序号
   */
  distory(index: number) {
    const item = this.data[index];
    this.data.splice(index, 1);
  }
}
