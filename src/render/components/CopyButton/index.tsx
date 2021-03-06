import React, { useCallback } from 'react';
import { Button, ButtonProps, message } from 'antd';
import { clipboard } from 'electron';

interface CopyButtonProps extends ButtonProps {
  text?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text = '', ...rest }) => {
  const onCopy = useCallback(() => {
    clipboard.writeText(text);
    message.success('ε€εΆζε');
  }, [text]);

  return <Button {...rest} onClick={onCopy} />;
};

export default CopyButton;
