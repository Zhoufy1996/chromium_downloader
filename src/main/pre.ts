import { app } from 'electron';
import pie from 'puppeteer-in-electron';
import path from 'path';
import { userDataFoldName } from '../common/constant';

app.setPath('userData', path.join(app.getPath('appData'), userDataFoldName));

// https://github.com/electron/electron/issues/7085
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app as any).setVersion(process.env.npm_package_version);
}
pie.initialize(app);
