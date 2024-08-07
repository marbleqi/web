import { HttpErrorResponse } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Provider, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { _HttpClient, SettingsService, TitleService } from '@delon/theme';
import type { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, mergeMap, zip, of, catchError, map } from 'rxjs';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
export function provideStartup(): Provider[] {
  return [
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupService) => () => startupService.load(),
      deps: [StartupService],
      multi: true
    }
  ];
}

@Injectable()
export class StartupService {
  private router = inject(Router);
  private http = inject(_HttpClient);
  private settingSrv = inject(SettingsService);
  private tokenSrv = inject(DA_SERVICE_TOKEN);
  private aclSrv = inject(ACLService);
  private titleSrv = inject(TitleService);

  load(): Observable<void> {
    return this.http.get('assets/config/api.json').pipe(
      mergeMap((res: NzSafeAny) => {
        console.debug(`获取API配置`, res.baseUrl, typeof res.baseUrl, typeof res.baseUrl !== 'string');
        if (typeof res?.baseUrl !== 'string') {
          throw '未配置有效后端地址！';
        }
        this.settingSrv.setData('baseUrl', res.baseUrl);
        console.debug(`获取token`, this.tokenSrv.get());
        const token = this.tokenSrv.get()?.token;
        // 判断令牌有效性
        if (token) {
          // 当令牌有效时，初始化应用信息的同时，也尝试初始化用户信息
          return this.http.get('account/startup').pipe(
            map((res: NzSafeAny) => {
              console.debug(`获取用户信息`, res);
              // 设置应用信息：包括应用名称，说明等
              this.settingSrv.setApp(res.app);
              // 设置浏览器标题栏后缀
              this.titleSrv.suffix = res.app.title || '管理平台';
              // 设置用户信息：包括姓名，头像
              this.settingSrv.setUser(res.user);
              // 设置用户权限点
              this.aclSrv.setAbility(res.ability);
            })
          );
        } else {
          // 当令牌无效时，只初始化应用信息
          return this.http.get('passport/startup').pipe(
            map((res: NzSafeAny) => {
              // 设置应用信息：包括应用名称，说明等
              this.settingSrv.setApp(res);
              // 设置浏览器标题栏后缀
              this.titleSrv.suffix = res?.title || '管理平台';
            })
          );
        }
      }),
      catchError((err: HttpErrorResponse) => {
        console.warn('发生异常：', err);
        this.router.navigateByUrl(this.tokenSrv.login_url!);
        return of(undefined);
      })
    );
  }
}
