import { Select, MenuItem, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import childProcess from 'child_process';
import useMessage from '../../hooks/useMessage';
import store, { Setting } from '../../../main/store';

const ProjectOpenView = () => {
  interface State {
    codePresets: Setting['codePresets'];
    current: string;
  }

  const [state, setState] = useState<State>({
    codePresets: [],
    current: '',
  });

  useEffect(() => {
    const codePresetsInStore = store.get('setting').codePresets;
    setState({
      codePresets: codePresetsInStore,
      current: (codePresetsInStore[0] && codePresetsInStore[0].path) || '',
    });
  }, []);

  const { Message, openMessage } = useMessage();

  const handleChange = (
    e: React.ChangeEvent<{
      value: unknown;
    }>
  ) => {
    setState((pre) => {
      return {
        ...pre,
        current: e.target.value as string,
      };
    });
  };
  const { codePresets, current } = state;

  const open = () => {
    const setting = store.get('setting');
    childProcess.exec(`${setting.vscodeCommand.value} ${current}`, (err) => {
      if (err) {
        openMessage('启动失败，请检查VSCode命令与项目地址');
      }
    });
  };

  return (
    <div>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={current}
        onChange={handleChange}
      >
        {codePresets.map((item) => {
          return (
            <MenuItem key={item.path} value={item.path}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>

      <Button variant="text" color="default" onClick={open}>
        打开
      </Button>
      <Message />
    </div>
  );
};

export default ProjectOpenView;
