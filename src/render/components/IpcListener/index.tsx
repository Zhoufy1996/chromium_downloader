import { useEffect } from 'react';
import { useHistory } from 'react-router';
import browerIpc, { Listener } from '../../ipc';

const IpcListener = () => {
  const history = useHistory();

  useEffect(() => {
    const listener: Listener = (_, path: string) => {
      history.push(path);
    };
    browerIpc.on('goto', listener);

    return () => {
      browerIpc.removeListener('goto', listener);
    };
  }, [history]);
  return null;
};

export default IpcListener;
