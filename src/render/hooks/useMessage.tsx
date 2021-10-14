import React, { useCallback, useMemo, useState } from 'react';
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar';

const useMessage = () => {
  interface State {
    open: boolean;
    message: string;
  }
  const [state, setState] = useState<State>({ open: false, message: '' });
  const { open, message } = state;
  const closeMessage = useCallback(() => {
    setState({
      open: false,
      message: '',
    });
  }, []);
  const Message = useCallback(
    (props: SnackbarProps) => {
      return (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          onClose={closeMessage}
          message={message}
          {...props}
        />
      );
    },
    [open, message, closeMessage]
  );
  const openMessage = useCallback(
    (msg: string, timeout = 3000) => {
      setState({
        open: true,
        message: msg,
      });
      if (timeout > 0) {
        setTimeout(() => {
          closeMessage();
        }, timeout);
      }
    },
    [closeMessage]
  );
  return {
    openMessage,
    closeMessage,
    Message,
  };
};

export default useMessage;
