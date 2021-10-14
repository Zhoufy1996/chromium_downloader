import ChromiumView from '../features/chromium/chromiumView';
import SettingView from '../features/setting/SettingView';

interface MenuConfig {
  key: string;
  path: string;
  title: string;
  component: () => JSX.Element;
}

const menuConfig: MenuConfig[] = [
  {
    key: 'chromium',
    path: '/chromium',
    title: 'chromium下载器',
    component: ChromiumView,
  },
  {
    key: 'setting',
    path: '/setting',
    title: '配置',
    component: SettingView,
  },
];

export const redirectPath = '/chromium';

export default menuConfig;
