import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { manifest } from '@ant-design/icons-angular';
import { I18nPipe, SettingsService, User, MenuService, Menu } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

/**图标类型 */
export type iconType = 'direction' | 'suggestion' | 'edit' | 'data' | 'logo' | 'other';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [...SHARED_IMPORTS]
})
export class IconComponent {
  /**缓存的图标列表 */
  iconMap: Map<iconType, string[]>;
  /**当前选中标签ID */
  index: number = 0;
  /**图标集 */
  tabs = [
    { title: '方向', type: 'direction' as iconType },
    { title: '建议', type: 'suggestion' as iconType },
    { title: '编辑', type: 'edit' as iconType },
    { title: '数据', type: 'data' as iconType },
    { title: '品牌', type: 'logo' as iconType },
    { title: '其他', type: 'other' as iconType }
  ];

  constructor(private readonly settingSrv: SettingsService) {
    this.settingSrv.setLayout('hideAside', true);
    this.iconMap = new Map<iconType, string[]>();
    /**所有图标 */
    const all = manifest['outline'] as string[];
    /**方向类图标 */
    const direction = [
      'step-backward',
      'step-forward',
      'fast-backward',
      'fast-forward',
      'shrink',
      'arrows-alt',
      'down',
      'up',
      'left',
      'right',
      'caret-up',
      'caret-down',
      'caret-left',
      'caret-right',
      'up-circle',
      'down-circle',
      'left-circle',
      'right-circle',
      'double-right',
      'double-left',
      'vertical-left',
      'vertical-right',
      'vertical-align-top',
      'vertical-align-middle',
      'vertical-align-bottom',
      'forward',
      'backward',
      'rollback',
      'enter',
      'retweet',
      'swap',
      'swap-left',
      'swap-right',
      'arrow-up',
      'arrow-down',
      'arrow-left',
      'arrow-right',
      'play-circle',
      'up-square',
      'down-square',
      'left-square',
      'right-square',
      'login',
      'logout',
      'menu-fold',
      'menu-unfold',
      'border-bottom',
      'border-horizontal',
      'border-inner',
      'border-outer',
      'border-left',
      'border-right',
      'border-top',
      'border-verticle',
      'pic-center',
      'pic-left',
      'pic-right',
      'radius-bottomleft',
      'radius-bottomright',
      'radius-upleft',
      'radius-upright',
      'fullscreen',
      'fullscreen-exit'
    ].sort((a, b) => a.localeCompare(b));
    this.iconMap.set('direction', direction);
    /**建议类图标 */
    const suggestion = [
      'question',
      'question-circle',
      'plus',
      'plus-circle',
      'pause',
      'pause-circle',
      'minus',
      'minus-circle',
      'plus-square',
      'minus-square',
      'info',
      'info-circle',
      'exclamation',
      'exclamation-circle',
      'close',
      'close-circle',
      'close-square',
      'check',
      'check-circle',
      'check-square',
      'clock-circle',
      'warning',
      'issues-close',
      'stop'
    ].sort((a, b) => a.localeCompare(b));
    this.iconMap.set('suggestion', suggestion);
    /**编辑类图标 */
    const edit = [
      'edit',
      'form',
      'copy',
      'scissor',
      'delete',
      'snippets',
      'diff',
      'highlight',
      'align-center',
      'align-left',
      'align-right',
      'bg-colors',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'redo',
      'undo',
      'zoom-in',
      'zoom-out',
      'font-colors',
      'font-size',
      'line-height',
      'dash',
      'small-dash',
      'sort-ascending',
      'sort-descending',
      'drag',
      'ordered-list',
      'unordered-list',
      'radius-setting',
      'column-width',
      'column-height',
      'insert-row-above',
      'insert-row-below',
      'insert-row-left',
      'insert-row-right',
      'delete-column',
      'delete-row',
      'rotate-left',
      'rotate-right'
    ].sort((a, b) => a.localeCompare(b));
    this.iconMap.set('edit', edit);
    /**数据类图标 */
    const data = [
      'area-chart',
      'pie-chart',
      'bar-chart',
      'dot-chart',
      'line-chart',
      'radar-chart',
      'heat-map',
      'fall',
      'rise',
      'stock',
      'box-plot',
      'fund',
      'sliders'
    ].sort((a, b) => a.localeCompare(b));
    this.iconMap.set('data', data);
    /**品牌类图标 */
    const logo = [
      'android',
      'apple',
      'windows',
      'ie',
      'chrome',
      'github',
      'aliwangwang',
      'dingding',
      'dingtalk',
      'weibo-square',
      'weibo-circle',
      'taobao-circle',
      'html5',
      'weibo',
      'twitter',
      'wechat',
      'youtube',
      'alipay-circle',
      'taobao',
      'skype',
      'qq',
      'medium-workmark',
      'gitlab',
      'medium',
      'linkedin',
      'google-plus',
      'dropbox',
      'facebook',
      'codepen',
      'code-sandbox',
      'amazon',
      'google',
      'codepen-circle',
      'alipay',
      'ant-design',
      'ant-cloud',
      'aliyun',
      'zhihu',
      'slack',
      'slack-square',
      'behance',
      'behance-square',
      'dribbble',
      'dribbble-square',
      'instagram',
      'yuque',
      'alibaba',
      'yahoo',
      'reddit',
      'sketch'
    ].sort((a, b) => a.localeCompare(b));
    this.iconMap.set('logo', logo);
    /**其他类图标 */
    const other = all
      .filter((item: string) => !direction.includes(item))
      .filter((item: string) => !suggestion.includes(item))
      .filter((item: string) => !edit.includes(item))
      .filter((item: string) => !data.includes(item))
      .filter((item: string) => !logo.includes(item))
      .sort((a, b) => a.localeCompare(b));
    this.iconMap.set('other', other);
  }
}
