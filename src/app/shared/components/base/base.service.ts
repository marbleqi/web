import { inject } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';

/**基础服务 */
export class BaseService {
  /**http服务 */
  protected http = inject(_HttpClient);
  /**项目配置服务 */
  protected settingSrv = inject(SettingsService);
}
