import { Tray, Menu, app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { getAssetPath, getFileSaveFolder } from './utils';
import { copyFile } from '../common/file';
import { getSpiderTrayMenu } from './chromium/service';

export const updateTrayMenu = async () => {
  const spiderTrayMenu = await getSpiderTrayMenu();
  const globalMenu = [
    {
      label: '显示主界面',
      click: () => {
        const mainWindow = BrowserWindow.fromId(global.mainId);
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    {
      label: '退出',
      click: () => {
        const mainWindow = BrowserWindow.fromId(global.mainId);
        mainWindow?.destroy();
        app.quit();
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate([
    ...spiderTrayMenu,
    ...globalMenu,
  ]);

  global.tray?.setContextMenu(contextMenu);
};

export const setTrayTooltip = (title: string) => {
  global.tray?.setToolTip(title);
};

export const createTray = () => {
  const iconPath = path.join(getFileSaveFolder(), 'tray.png');
  if (!fs.existsSync(iconPath)) {
    try {
      copyFile(getAssetPath('tray.png'), iconPath);
    } catch (e) {
      console.log(`copy error: ${e}`);
    }
  }

  global.tray = new Tray(iconPath);
  updateTrayMenu();
};
