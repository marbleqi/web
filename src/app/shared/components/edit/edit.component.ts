import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { SFComponent, SFUISchema } from '@delon/form';
import { BaseComponent } from '@shared';
import { Observable } from 'rxjs';

/**通用编辑组件 */
@Component({
  selector: 'app-edit',
  standalone: true,
  template: ''
})
export class EditComponent extends BaseComponent {
  /**页面类型：创建、编辑、复制 */
  type!: 'add' | 'edit' | 'copy';
  /**列表页路径 */
  baseUrl!: string;
  /**对象名称 */
  name!: string;
  /**主标题 */
  title!: string;
  /**提交按钮文字 */
  buttonName!: string;
  /**表单 */
  @ViewChild('sf') readonly sf!: SFComponent;
  /**表单样式 */
  ui!: SFUISchema;
  /**表单初始数据 */
  i: any;
  /**表单提交数据 */
  value: any;
  /**获取初始数据，需继承后实现 */
  show!: () => Observable<any>;
  /**创建对象，需继承后实现 */
  create!: () => Observable<any>;
  /**更新对象，需继承后实现 */
  update!: () => Observable<any>;

  /**编辑页初始化 */
  edit() {
    this.type = this.route.snapshot.data['type'];
    if (this.type === 'add') {
      this.title = `新建${this.name}`;
      this.buttonName = '提交';
      this.init();
      this.loading = false;
    } else {
      if (!this.route.snapshot.params['id']) {
        this.message.error(`${this.name}id不存在`);
        this.router.navigateByUrl(this.baseUrl);
      } else {
        if (this.type === 'edit') {
          this.title = `修改${this.name}`;
          this.buttonName = '保存';
        } else {
          this.title = `克隆${this.name}`;
          this.buttonName = '提交';
        }
        this.show().subscribe(res => {
          console.debug(`${this.name}数据`, res);
          this.init(res);
          this.loading = false;
        });
      }
    }
  }

  /**
   * 表单数据初始化，可重写
   * @param record 原始记录
   */
  init(record?: any) {
    if (record) {
      this.i = record;
      this.value = record;
      if (this.type === 'edit') {
        this.ui['$id'].hidden = false;
      }
    } else {
      this.i = { status: true };
      this.value = { status: true };
    }
  }

  /**
   * 提交，可重写
   * @param back 是否返回列表页
   */
  save(back: boolean = true): void {
    this.value = { ...this.value, id: undefined, create: undefined, update: undefined };
    console.debug(`提交${this.name}数据`, this.value);
    if (this.type === 'edit') {
      this.update().subscribe({
        next: res => {
          console.debug(`修改${this.name}`, res);
          this.message.success(`${this.name}修改成功`);
          if (back) {
            this.router.navigateByUrl(this.baseUrl);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.message.error(err.error.message);
        }
      });
    } else {
      this.create().subscribe({
        next: res => {
          console.debug(`创建${this.name}`, res);
          this.message.success(`${this.name}创建成功`);
          if (back) {
            this.router.navigateByUrl(this.baseUrl);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.message.error(err.error.message);
        }
      });
    }
  }
}
