import type { SFWidgetProvideConfig } from '@delon/form';
// import { withCascaderWidget } from '@delon/form/widgets/cascader';

import { AtWidget } from './at/at.widget';
import { ListWidget } from './list/list.widget';
import { OperateWidget } from './operate/operate.widget';

export const SF_WIDGETS: SFWidgetProvideConfig[] = [
  { KEY: AtWidget.KEY, type: AtWidget },
  { KEY: ListWidget.KEY, type: ListWidget },
  { KEY: OperateWidget.KEY, type: OperateWidget }
  // Non-built-in widget registration method
  // withCascaderWidget()
];
