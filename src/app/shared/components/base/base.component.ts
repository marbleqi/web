import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReuseTabService, OnReuseInit } from '@delon/abc/reuse-tab';
import { SettingsService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
/**基础组件 */
@Component({
  selector: 'app-base',
  standalone: true,
  template: ''
})
export class BaseComponent implements OnInit, OnReuseInit {
  /**加载状态 */
  loading: boolean = true;
  /**左侧菜单主目录 */
  protected main: string = '';
  /**路由服务 */
  protected readonly router = inject(Router);
  /**消息服务 */
  protected readonly message = inject(NzMessageService);
  /**当前路由快照 */
  protected readonly route = inject(ActivatedRoute);
  /**项目配置服务 */
  protected readonly settingSrv = inject(SettingsService);
  /**路由复用服务 */
  protected readonly reuseSrv = inject(ReuseTabService);
  /**刷新页面，需继承后实现 */
  reload!: (init?: boolean) => void;

  /**页面初始化 */
  ngOnInit(): void {
    console.debug('基础页面初始化！！');
    if (this.main) {
      this.settingSrv.setLayout('main', this.main);
    }
    this.reload();
  }

  /**路由复用初始化 */
  _onReuseInit() {
    console.debug('路由复用页面初始化！！');
    if (this.main) {
      this.settingSrv.setLayout('main', this.main);
    }
    this.reload();
  }
}
