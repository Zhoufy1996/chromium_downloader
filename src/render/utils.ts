import childProcess from 'child_process';
import { ipcRenderer, remote } from 'electron';

const isChromiumProcess = (
  pid: string,
  includesStr: string
): Promise<string | boolean> => {
  return new Promise((resolve) => {
    childProcess.exec(
      `wmic process get name, executablepath, processid|findstr ${pid}`,
      (pErr, pStdout) => {
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

  childProcess.exec(`tasklist | findStr "chrome"`, (err, stdout) => {
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

interface HandleExecuteScriptProps {
  scriptTemplate: string;
  params: {
    [name: string]: string;
  };
}

export const handleExecuteScript = ({
  scriptTemplate,
  params,
}: HandleExecuteScriptProps) => {
  let scriptCode = scriptTemplate;
  Object.keys(params).forEach((name) => {
    scriptCode = scriptCode.replace(RegExp(`{${name}}`, 'g'), params[name]);
  });
  childProcess.exec(scriptCode);
};

export const handleGetParams = (scriptTemplate: string) => {
  if (typeof scriptTemplate !== 'string') {
    return [];
  }
  const paramNames = [
    ...new Set(
      scriptTemplate.match(/{.*?}/g)?.map((param) => {
        return param.substring(1, param.length - 1);
      })
    ),
  ];
  return paramNames;
};

export const isMainWindow = () => {
  console.log(remote.getCurrentWindow().id);
  console.log(remote.getGlobal('mainId'));
  return remote.getCurrentWindow().id === remote.getGlobal('mainId');
};
