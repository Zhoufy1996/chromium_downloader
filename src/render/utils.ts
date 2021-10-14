import childProcess from 'child_process';
import { ipcRenderer } from 'electron';

const isChromiumProcess = (
  pid: string,
  includesStr: string
): Promise<string | boolean> => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      `wmic process get name, executablepath, processid|findstr ${pid}`,
      (pErr, pStdout, pStderr) => {
        if (pErr) {
          resolve(false);
          return;
        }

        if (pStdout.includes(includesStr)) {
          resolve(pid);
          return;
        }
        resolve(false);
      }
    );
  });
};

export const killAllChromiumProcess = async (callback?: () => unknown) => {
  const userData = await ipcRenderer.invoke('get-userData-path');
  const killChromiumPidList = async (pidList: string[]) => {
    const chromiumPids = (
      await Promise.all(
        pidList.map((pid) => {
          return isChromiumProcess(pid, userData);
        })
      )
    ).filter((pid) => pid);

    childProcess.exec(
      `taskkill ${chromiumPids.map((pid) => `/PID ${pid}`).join(' ')} -t -f`,
      (error) => {
        if (error) {
          console.log(error);
        }
        if (callback) {
          callback();
        }
      }
    );
  };

  childProcess.exec(`tasklist | findStr "chrome"`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }

    const chromeProcessPids = stdout.split('\n').map((line) => {
      const processMessage = line.trim().split(/\s+/);
      return processMessage[1];
    });

    killChromiumPidList(chromeProcessPids);
  });
};
