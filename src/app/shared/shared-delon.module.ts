import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { PageHeaderModule } from '@delon/abc/page-header';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { SEModule } from '@delon/abc/se';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { DelonFormModule } from '@delon/form';

export const SHARED_DELON_MODULES = [PageHeaderModule, STModule, SEModule, SVModule, DelonFormModule, ReuseTabModule, FooterToolbarModule];
