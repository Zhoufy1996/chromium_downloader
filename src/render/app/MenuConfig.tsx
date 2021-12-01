import ChromiumView from '../views/chromium';
import IpcMessageView from '../views/ipcmessage';
import ScriptView from '../views/script';
import SettingView from '../views/setting';

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
    title: 'chromium下载',
    component: ChromiumView,
  },
  {
    key: 'script',
    path: '/script',
    title: '脚本',
    component: ScriptView,
  },
  {
    key: 'setting',
    path: '/setting',
    title: '设置',
    component: SettingView,
  },
  {
    key: 'ipcmessage',
    path: '/ipcmessage',
    title: '设置',
    component: IpcMessageView,
  },
];

export const redirectPath = '/chromium';

export default menuConfig;
