import { chromiumFoldName, configFoldName } from '../common/constant';
import { createFolder } from '../common/file';
import { registListeners } from './ipc/listener';
import { createTray } from './tray';

const init = () => {
  createFolder(chromiumFoldName);
  createFolder(configFoldName);
  registListeners();
  createTray();
};

export default init;
