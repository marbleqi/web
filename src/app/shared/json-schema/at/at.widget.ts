import { Component } from '@angular/core';
import { ControlWidget } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { format, fromUnixTime } from 'date-fns';

@Component({
  selector: 'sf-widget-at',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './at.widget.html'
})
export class AtWidget extends ControlWidget {
  /**小部件key */
  static readonly KEY = 'at';
  /**时间 */
  at!: string;

  override reset(value: number) {
    super.reset(value);
    if (value) {
      if (this.schema?.['timestamp'] && this.schema['timestamp'] === 's') {
        this.at = format(fromUnixTime(value), 'yyyy-MM-dd HH:mm:ss');
      } else {
        this.at = format(value, 'yyyy-MM-dd HH:mm:ss.SSS');
      }
    }
  }
}
