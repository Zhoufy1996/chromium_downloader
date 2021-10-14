import { app } from 'electron';
import pie from 'puppeteer-in-electron';
import path from 'path';
import { userDataFoldName } from '../common/constant';

app.setPath('userData', path.join(app.getPath('appData'), userDataFoldName));
pie.initialize(app);
