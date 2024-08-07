import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {
  /**传入的头像地址 */
  @Input() url: string = '';
  /**菜单改变事件 */
  @Output() readonly nzChange = new EventEmitter<string>();
}
