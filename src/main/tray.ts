import { Tray, Menu, app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { getAssetPath, getFileSaveFolder } from './utils';
import { copyFile } from '../common/file';
// eslint-disable-next-line import/no-cycle
import { startSpider, stopSpider } from './chromium';

export const updateTrayMenu = () => {
  const { isCollecting } = global;
  const contextMenu = Menu.buildFromTemplate([
    isCollecting
      ? {
          label: '停止爬虫',
          click: () => {
            stopSpider();
          },
        }
      : {
          label: '获取配置',
          click: () => {
            startSpider();
          },
        },
    {
      label: '显示主界面',
      click: () => {
        const mainWindow = BrowserWindow.fromId(global.mianId);
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    {
      label: '退出',
      click: () => {
        const mainWindow = BrowserWindow.fromId(global.mianId);
        mainWindow?.destroy();
        app.quit();
      },
    },
  ]);
  global.tray?.setContextMenu(contextMenu);
};

export const setTrayTooltip = (title: string) => {
  global.tray?.setTitle(title);
};

export const initialTrayTooltip = () => {
  global.tray?.setTitle('chromium下载器');
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
  initialTrayTooltip();
};
