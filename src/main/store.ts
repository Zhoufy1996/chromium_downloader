import { app, remote } from 'electron';
import Store from 'electron-store';

export type Revisions = string[];

export interface RevisionToVersionMap {
  [revision: string]: string;
}

interface SettingItem {
  value: string | number;
  type: 'text' | 'number';
  label: string;
}

export interface Setting {
  [key: string]: SettingItem;
}

export interface Script {
  name: string;
  scriptTemplate: string;
  presetParams: { key: string; alias: string; [name: string]: string }[];
  key: string;
}

export interface IpData {
  name: string;
  ip: string;
}

export const initialSetting: Setting = {
  prefix: {
    value: 'Win',
    type: 'text',
    label: 'prefix',
  },
  interval: {
    value: 500,
    type: 'number',
    label: 'interval',
  },
};

const store = new Store<{
  revisions: Revisions;
  revisionToVersionMap: RevisionToVersionMap;
  setting: Setting;
  scripts: Script[];
  ips: IpData[];
}>({
  defaults: {
    revisions: [],
    revisionToVersionMap: {},
    setting: initialSetting,
    scripts: [],
    ips: [],
  },
  cwd: app ? app.getPath('userData') : remote.app.getPath('userData'),
  migrations: {
    '0.0.5': (s) => {
      store.set('ips', []);
    },
  },
});

export default store;
