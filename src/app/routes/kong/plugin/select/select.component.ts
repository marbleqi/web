import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { KongPluginService } from '../..';

/**插件类型 */
export type PluginType = 'auth' | 'security' | 'traffic' | 'monitor' | 'transformation' | 'log' | 'other';

@Component({
  selector: 'app-kong-plugin-select',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './select.component.html'
})
export class KongPluginSelectComponent implements OnInit {
  /**缓存的插件列表 */
  pluginMap: Map<PluginType, string[]> = new Map<PluginType, string[]>();
  /**当前选中标签ID */
  index: number = 0;
  /**插件集 */
  tabs = [
    { title: '认证', type: 'auth' as PluginType },
    { title: '安全', type: 'security' as PluginType },
    { title: '拦截', type: 'traffic' as PluginType },
    { title: '监控', type: 'monitor' as PluginType },
    { title: '转换', type: 'transformation' as PluginType },
    { title: '日志', type: 'log' as PluginType },
    { title: '其他', type: 'other' as PluginType }
  ];
  /**实例ID */
  @Input() instance!: number;
  /**预选插件 */
  @Input() plugin!: string;
  /**插件变动事件 */
  @Output() readonly change = new EventEmitter<string>();

  constructor(private pluginSrv: KongPluginService) {}

  ngOnInit(): void {
    this.pluginSrv.enum(this.instance).subscribe((res: string[]) => {
      const auth = ['basic-auth', 'hmac-auth', 'jwt', 'key-auth', 'ldap-auth', 'oauth2', 'session'].filter(item => res.includes(item));
      this.pluginMap.set('auth', auth);
      const security = ['acme', 'bot-detection', 'cors', 'ip-restriction'].filter(item => res.includes(item));
      this.pluginMap.set('security', security);
      const traffic = [
        'acl',
        'proxy-cache',
        'http301https',
        'rate-limiting',
        'request-size-limiting',
        'request-termination',
        'response-ratelimiting'
      ].filter(item => res.includes(item));
      this.pluginMap.set('traffic', traffic);
      const monitor = ['datadog', 'opentelemetry', 'prometheus', 'zipkin'].filter(item => res.includes(item));
      this.pluginMap.set('monitor', monitor);
      const transformation = ['correlation-id', 'grpc-gateway', 'grpc-web', 'request-transformer', 'response-transformer'].filter(item =>
        res.includes(item)
      );
      this.pluginMap.set('transformation', transformation);
      const log = ['file-log', 'http-log', 'loggly', 'statsd', 'syslog', 'tcp-log', 'udp-log'].filter(item => res.includes(item));
      this.pluginMap.set('log', log);
      const other = res
        .filter(item => !auth.includes(item))
        .filter(item => !security.includes(item))
        .filter(item => !traffic.includes(item))
        .filter(item => !monitor.includes(item))
        .filter(item => !transformation.includes(item))
        .filter(item => !log.includes(item));
      this.pluginMap.set('other', other);
      if (this.plugin) {
        /**预选图标类型 */
        const type = Array.from(this.pluginMap).filter(item => item[1].includes(this.plugin))[0][0];
        // 设置预选图标类型标签页
        this.index = this.tabs.map(item => item.type).indexOf(type);
      }
    });
  }
}
