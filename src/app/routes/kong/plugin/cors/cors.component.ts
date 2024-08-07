import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-kong-plugin-cors',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './cors.component.html'
})
export class KongPluginCorsComponent {
  /**表单 */
  @ViewChild('sf') readonly sf!: SFComponent;
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      origins: { type: 'string', title: 'origins', default: [] },
      headers: { type: 'string', title: 'headers', default: [] },
      exposed_headers: { type: 'string', title: 'exposed_headers', default: [] },
      methods: {
        type: 'string',
        title: 'methods',
        default: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT'],
        enum: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT']
      },
      max_age: { type: 'number', title: 'max_age', default: 0 },
      credentials: { type: 'boolean', title: 'credentials', default: false },
      private_network: { type: 'boolean', title: 'private_network', default: false },
      preflight_continue: { type: 'boolean', title: 'preflight_continue', default: false }
    },
    required: []
  };
  /**表单样式 */
  ui: SFUISchema = {
    '*': { spanLabelFixed: 200, grid: { span: 12 } },
    $origins: { widget: 'list', optionalHelp: 'Access-Control-Allow-Origin' },
    $headers: { widget: 'list', optionalHelp: 'Access-Control-Allow-Headers' },
    $exposed_headers: { widget: 'list', optionalHelp: 'Access-Control-Expose-Headers' },
    $methods: { widget: 'select', mode: 'multiple', optionalHelp: 'Access-Control-Allow-Methods' },
    $max_age: { optionalHelp: '缓存时间，单位秒' },
    $credentials: { optionalHelp: 'Access-Control-Allow-Credentials' },
    $private_network: { optionalHelp: 'Access-Control-Allow-Private-Network' },
    $preflight_continue: { optionalHelp: '是否将OPTIONS请求转发上游' }
  };
  /**初始数据 */
  @Input() config: any;
  /**数据变更回调 */
  @Output() readonly change = new EventEmitter<any>();
}
