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

interface CodePreset {
  path: string;
  name: string;
}
export interface Setting {
  prefix: SettingItem;
  interval: SettingItem;
  vscodeCommand: SettingItem;
  codePresets: CodePreset[];
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
  vscodeCommand: {
    value: 'code',
    type: 'text',
    label: 'vscode-command',
  },
  codePresets: [],
};

const store = new Store<{
  revisions: Revisions;
  revisionToVersionMap: RevisionToVersionMap;
  setting: Setting;
}>({
  defaults: {
    revisions: [],
    revisionToVersionMap: {},
    setting: initialSetting,
  },
  cwd: app ? app.getPath('userData') : remote.app.getPath('userData'),
  migrations: {
    '0.0.1': (s) => {
      s.set('setting.vscodeCommand', initialSetting.vscodeCommand);
    },
    '0.0.2': (s) => {
      s.set('setting.codePresets', initialSetting.codePresets);
    },
    '0.0.3': (s) => {
      s.set('setting.codePresets', []);
    },
    '0.0.4': (s) => {
      s.set('setting.codePresets', initialSetting.codePresets);
    },
  },
});

export default store;
