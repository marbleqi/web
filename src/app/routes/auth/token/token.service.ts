import { Injectable } from '@angular/core';
import { BaseService } from '@shared';
import { Observable, Subject } from 'rxjs';

/**令牌服务 */
@Injectable()
export class AuthTokenService extends BaseService {
  /**数据变更订阅 */
  dataSub: Subject<any[]> = new Subject<any[]>();

  /**
   * 获取令牌列表
   * @returns 令牌列表
   */
  index(): void {
    this.http.get(`auth/token/index`).subscribe((res: any[]) => {
      this.dataSub.next(res);
    });
  }

  /**
   * 获取令牌列表
   * @returns 令牌列表
   */
  destroy(token: string): Observable<any[]> {
    return this.http.delete(`auth/token/destroy/${token}`);
  }
}
