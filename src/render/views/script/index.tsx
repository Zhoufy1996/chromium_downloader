import { Button, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import store, { Script } from '../../../main/store';

const ScriptView = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const handleGetScript = useCallback(() => {
    setScripts(store.get('scripts'));
  }, []);

  useEffect(() => {
    handleGetScript();
  }, [handleGetScript]);

  return (
    <div>
      <div>
        <Button onClick={handleGetScript}>刷新</Button>
      </div>
    </div>
  );
};

export default ScriptView;
