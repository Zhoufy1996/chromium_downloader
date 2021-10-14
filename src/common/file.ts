import fs from 'fs';
import path from 'path';

import { readdir } from 'fs-extra';
import { getFileSaveFolder } from '../main/utils';
import { chromeFoldName } from './constant';

export const createFolder = (
  folderName: string,
  basePath = getFileSaveFolder()
) => {
  const fullPath = path.join(basePath, folderName);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }
};

export const copyFile = (src: string, dist: string) => {
  return fs.writeFileSync(dist, fs.readFileSync(src));
};

export const getLocalChromiumFolderNames = async (userDataPath: string) => {
  return readdir(path.join(userDataPath, chromeFoldName));
};

export const getLocalChromiumRevisions = async (userDataPath: string) => {
  const LocalChromiumfolderNames = await getLocalChromiumFolderNames(
    userDataPath
  );
  return LocalChromiumfolderNames.map((name) => {
    return name.split('-')[1];
  });
};
