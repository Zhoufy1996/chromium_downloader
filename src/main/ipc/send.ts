import {
  destorySpider,
  getSpiderMessage,
  isFinished,
  saveToStore,
} from '../chromium/service';
import { setTrayTooltip, updateTrayMenu } from '../tray';
import { getMainBrower } from '../utils';

export const setIntervalSpider = async () => {
  const timerId = setInterval(async () => {
    const execute = async () => {
      const message = await getSpiderMessage();
      const mainBrowser = getMainBrower();
      mainBrowser?.webContents.send('chromium-spider-res', message);
      updateTrayMenu();
      setTrayTooltip(message);
      saveToStore();
    };
    await execute();

    if (isFinished()) {
      await execute();
      clearInterval(timerId);
      destorySpider();
    }
  }, 1000);

  return () => {
    clearInterval(timerId);
  };
};
