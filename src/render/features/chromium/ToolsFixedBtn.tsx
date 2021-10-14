import React, { useEffect, useCallback } from 'react';
import {
  makeStyles,
  Theme,
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
import path from 'path';
import FolderIcon from '@material-ui/icons/Folder';
import ClearIcon from '@material-ui/icons/Clear';
import RefreshIcon from '@material-ui/icons/Refresh';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import useMessage from '../../hooks/useMessage';
import { chromeFoldName } from '../../../common/constant';
import LocalChromiumContainer from '../../stores/localChromium';
import store from '../../../main/store';
import { killAllChromiumProcess } from '../../utils';
import { getSpiderResMessage } from '../../../common/chromium';

const useStyles = makeStyles((theme: Theme) => {
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
  const { Message, openMessage } = useMessage();
  const {
    GetLocalChromiumPaths,
    handleSpider,
    spiderRes,
  } = LocalChromiumContainer.useContainer();
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'chromium-fixed-btn',
  });

  const handleOpenFolder = useCallback(async () => {
    const userData = await ipcRenderer.invoke('get-userData-path');
    shell.openPath(path.join(userData, chromeFoldName));
    popupState.close();
  }, [popupState]);

  const handleKillAllChromiumProcess = useCallback(async () => {
    killAllChromiumProcess(() => {
      openMessage('chromium进程结束成功');
    });
    popupState.close();
  }, [openMessage, popupState]);

  const handleRefresh = useCallback(async () => {
    await GetLocalChromiumPaths();
    openMessage('刷新成功');
    popupState.close();
  }, [GetLocalChromiumPaths, openMessage, popupState]);

  const handleOpenCOnfig = useCallback(async () => {
    store.openInEditor();
  }, []);

  const handleGetSpider = useCallback(() => {
    handleSpider();
    openMessage('开始获取配置');
    popupState.close();
  }, [popupState, openMessage, handleSpider]);

  const { step } = spiderRes;

  const spiderResMessage = getSpiderResMessage(spiderRes);

  useEffect(() => {
    if (step === 'ERROR' || step === 'FINISHED') {
      openMessage(spiderResMessage, 0);
    }
  }, [step, spiderResMessage, openMessage]);

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
          <Tooltip title="杀死所有chromium进程">
            <IconButton
              aria-label="kill-chromium-process"
              onClick={handleKillAllChromiumProcess}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="刷新">
            <IconButton aria-label="refresh" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="打开配置文件">
            <IconButton aria-label="open-config" onClick={handleOpenCOnfig}>
              <PermDataSettingIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={spiderResMessage || '获取配置'}>
            <IconButton aria-label="open-config" onClick={handleGetSpider}>
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Popover>
      <Message />
    </>
  );
};

export default ToolsFixedBtn;
