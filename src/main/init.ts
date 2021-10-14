import { chromeFoldName } from '../common/constant';
import { createFolder } from '../common/file';
import registerEvent from './ipc';
import { createTray } from './tray';

const init = () => {
  createFolder(chromeFoldName);
  registerEvent();
  createTray();
};

export default init;
