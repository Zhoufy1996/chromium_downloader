import {
  TextField,
  makeStyles,
  createStyles,
  Theme,
  Button,
} from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';

import store, { initialSetting, Setting } from '../../../main/store';
import useMessage from '../../hooks/useMessage';
import ToolsFixedBtn from './ToolsFixedBtn';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      padding: theme.spacing(1),
    },
    settingContainer: {
      marginTop: theme.spacing(1),
    },
    textField: {
      marginTop: theme.spacing(2),
    },
    btnGroup: {
      marginTop: theme.spacing(1),
    },
    saveBtn: {
      marginRight: theme.spacing(1),
    },
  });
});

const SettingView = () => {
  type State = {
    setting: Setting | null;
  };

  const [state, setState] = useState<State>({
    setting: null,
  });

  const classes = useStyles();

  const { Message, openMessage } = useMessage();

  const handleRefresh = useCallback(() => {
    const setting = store.get('setting');
    setState((pre) => {
      return {
        ...pre,
        setting,
      };
    });
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const { setting } = state;

  const handleSaveToConfig = () => {
    store.set('setting', setting);
    openMessage('保存成功');
  };

  const handleReset = () => {
    store.set('setting', initialSetting);
    handleRefresh();
    openMessage('重置成功');
  };

  return (
    <div className={classes.root}>
      <ToolsFixedBtn />
      <div className={classes.settingContainer}>
        {setting &&
          Object.keys(setting).map((key) => {
            const settingKey = key as keyof Setting;
            const item = setting[settingKey];
            return (
              <div key={key} className={classes.textField}>
                <TextField
                  label={item.label}
                  value={item.value}
                  type={item.type}
                  variant="outlined"
                  onChange={(e) => {
                    setState((pre) => {
                      const preSetting = pre.setting as Setting;
                      return {
                        ...pre,
                        setting: {
                          ...preSetting,
                          [key]: {
                            ...preSetting[settingKey],
                            value: e.target.value,
                          },
                        },
                      };
                    });
                  }}
                />
              </div>
            );
          })}
        <div className={classes.btnGroup}>
          <Button
            onClick={handleSaveToConfig}
            variant="contained"
            color="primary"
            className={classes.saveBtn}
          >
            保存
          </Button>
          <Button onClick={handleReset} variant="contained" color="secondary">
            重置
          </Button>
        </div>
      </div>
      <Message />
    </div>
  );
};

export default SettingView;
