import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import browerIpc, { Listener } from '../ipc';

const useIpcRes = () => {
  interface State {
    chromiumSpiderRes: string;
  }

  const [state, setState] = useState<State>({
    chromiumSpiderRes: '',
  });

  useEffect(() => {
    const listener: Listener = (_, message: string) => {
      setState((pre) => {
        return {
          ...pre,
          chromiumSpiderRes: message,
        };
      });
    };
    browerIpc.on('chromium-spider-res', listener);

    return () => {
      browerIpc.removeListener('chromium-spider-res', listener);
    };
  }, []);

  return {
    chromiumSpiderRes: state.chromiumSpiderRes,
  };
};

const IpcResContainer = createContainer(useIpcRes);

export default IpcResContainer;
