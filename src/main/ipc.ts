import { ipcMain, app, BrowserWindow } from 'electron';
import ChromiumService, { startSpider } from './chromium';
import store from './store';
import { getFileSaveFolder } from './utils';

const registerCommonEvent = () => {
  ipcMain.handle('update-store-file', (_, obj) => {
    return store.set(obj);
  });

  ipcMain.handle('get-userData-path', () => {
    return getFileSaveFolder();
  });

  ipcMain.on('ondragstart', async (event, filepath) => {
    const icon = await app.getFileIcon(filepath);
    event.sender.startDrag({
      file: filepath,
      icon,
    });
  });

  ipcMain.on('close', () => {
    const mainWindow = BrowserWindow.fromId(global.mianId);
    mainWindow?.destroy();
    app.quit();
  });

  ipcMain.on('hide', () => {
    const mainWindow = BrowserWindow.fromId(global.mianId);
    mainWindow?.hide();
  });
};

const registerChromiumEvent = () => {
  ipcMain.on('start-chromium-spider', () => {
    startSpider();
  });

  ipcMain.handle('download-chrome', (_, revision) => {
    return ChromiumService.downloadChromium({ revision });
  });
};

const registerEvent = () => {
  registerCommonEvent();
  registerChromiumEvent();
};

export default registerEvent;
