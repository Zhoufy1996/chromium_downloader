import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Listener } from '../../ipc';

const IpcListener = () => {
  const history = useHistory();

  useEffect(() => {
    const listener: Listener = (_, path: string) => {
      history.push(path);
    };
    ipcRenderer.on('goto', listener);

    return () => {
      ipcRenderer.removeListener('goto', listener);
    };
  }, [history]);
  return null;
};

export default IpcListener;
