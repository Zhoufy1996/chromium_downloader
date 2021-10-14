import React, { useCallback } from 'react';
import path from 'path';
import {
  makeStyles,
  createStyles,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  bindTrigger,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Popover from '@material-ui/core/Popover';
import { shell, ipcRenderer } from 'electron';
import FolderIcon from '@material-ui/icons/Folder';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import { chromeFoldName } from '../../../common/constant';
import store from '../../../main/store';

const useStyles = makeStyles(() => {
  return createStyles({
    fab: {
      position: 'fixed',
      zIndex: 1,
      right: 5,
      top: 70,
      opacity: 0.2,
      '&:hover': {
        opacity: 0.5,
      },
    },
    btnGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
  });
});

const ToolsFixedBtn = () => {
  const classes = useStyles();
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'chromium-fixed-btn',
  });

  const handleOpenFolder = useCallback(async () => {
    const userData = await ipcRenderer.invoke('get-userData-path');
    shell.openPath(path.join(userData, chromeFoldName));
    popupState.close();
  }, [popupState]);

  const handleOpenCOnfig = useCallback(async () => {
    store.openInEditor();
  }, []);

  return (
    <>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="extend"
        size="small"
        {...bindTrigger(popupState)}
      >
        <AddIcon />
      </Fab>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.btnGroup}>
          <Tooltip title="打开下载文件夹">
            <IconButton
              aria-label="open-download-folder"
              onClick={handleOpenFolder}
            >
              <FolderIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="打开配置文件">
            <IconButton aria-label="open-config" onClick={handleOpenCOnfig}>
              <PermDataSettingIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Popover>
    </>
  );
};

export default ToolsFixedBtn;
