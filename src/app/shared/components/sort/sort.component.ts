import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**通用列表组件 */
@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [...SHARED_IMPORTS, DragDropModule],
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.less']
})
export class SortComponent {
  /**表头标题 */
  @Input() titles!: string[];
  /**数据字段 */
  @Input() fields!: string[];
  /**排序数据 */
  @Input() data!: any[];
  /**排序后数据 */
  @Output() readonly dataChange = new EventEmitter<any[]>();

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    let i = 1;
    this.data = this.data.map((item: any) => ({ ...item, index: i++ }));
    this.dataChange.emit(this.data);
  }
}
