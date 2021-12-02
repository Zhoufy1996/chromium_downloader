import { app, BrowserWindow } from 'electron';
import path from 'path';
import { chromiumFoldName } from '../common/constant';

export const getFileSaveFolder = () => {
  return app.getPath('userData');
};

export const getChromiumSavePath = () => {
  return path.join(getFileSaveFolder(), chromiumFoldName);
};

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(process.cwd(), 'assets');
  return path.join(RESOURCES_PATH, ...paths);
};

export const getMainBrower = () => {
  const mainBrowser = BrowserWindow.fromId(global.mainId);
  return mainBrowser;
};
