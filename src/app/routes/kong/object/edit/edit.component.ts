import { Component } from '@angular/core';
import { EditComponent } from '@shared';

@Component({
  selector: 'app-kong-object-edit',
  standalone: true,
  template: ''
})
export class KongObjectEditComponent extends EditComponent {
  /**APISIX实例ID */
  instance!: number;
  /**对象ID */
  id!: string;

  /**构造函数 */
  constructor() {
    super();
    this.reload = () => {
      this.instance = Number(this.route.snapshot.params['instance']);
      this.id = this.route.snapshot.params['id'] || '';
      this.edit();
    };
  }
}
