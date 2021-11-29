import { ipcMain, app, BrowserWindow } from 'electron';
import { downloadChromium } from '../chromium/remote';
import {
  continueSpider,
  pauseSpider,
  startSpider,
  stopSpider,
} from '../chromium/service';
import store from '../store';
import { getChromiumSavePath, getFileSaveFolder } from '../utils';
import { setIntervalSpider } from './send';

export const registListeners = () => {
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

  ipcMain.on('start-chromium-spider', () => {
    startSpider();
    setIntervalSpider();
  });

  ipcMain.on('pause-chromium-spider', () => {
    pauseSpider();
  });

  ipcMain.on('continue-chromium-spider', () => {
    continueSpider();
  });

  ipcMain.on('stop-chromium-spider', () => {
    stopSpider();
  });

  ipcMain.handle('download-chrome', (_, revision) => {
    return downloadChromium({ revision, downloadPath: getChromiumSavePath() });
  });

  ipcMain.on('open-new-browser', (_, path: string) => {
    const subWindow = new BrowserWindow({
      show: true,
      width: 1024,
      height: 728,
      minHeight: 400,
      minWidth: 600,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });
    subWindow.loadURL(`file://${__dirname}/index.html/#/${path}`);
  });
};
