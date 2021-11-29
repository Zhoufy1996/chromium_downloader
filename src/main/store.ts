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
  prefix: SettingItem;
  interval: SettingItem;
}

export interface Script {
  name: string;
  scriptTemplate: string;
  presetParams: { [name: string]: string }[];
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
}>({
  defaults: {
    revisions: [],
    revisionToVersionMap: {},
    setting: initialSetting,
    scripts: [],
  },
  cwd: app ? app.getPath('userData') : remote.app.getPath('userData'),
  migrations: {},
});

export default store;
