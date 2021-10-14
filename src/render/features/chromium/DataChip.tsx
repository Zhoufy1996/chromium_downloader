import React, { useCallback } from 'react';
import {
  bindTrigger,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import Chip from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, Tooltip } from '@material-ui/core';
import { shell } from 'electron';
import classNames from 'classnames';
import LocalChromiumContainer from '../../stores/localChromium';

const useStyles = makeStyles((theme: Theme) => {
  return {
    chip: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
});

interface DataChipProps {
  version: string;
  revision: string;
  isDownload: boolean;
  executablePath: string;
  folderPath: string;
}

const DataChip: React.FC<DataChipProps> = ({
  version,
  revision,
  isDownload,
  executablePath,
  folderPath,
}) => {
  const classes = useStyles();
  const {
    downloadChrome,
    deleteChrome,
    downloadingRevision,
  } = LocalChromiumContainer.useContainer();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: revision,
  });

  // 打不开怎么办
  const handleOpenChrome = () => {
    try {
      shell.openPath(executablePath);
      popupState.close();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteChrome = () => {
    deleteChrome(folderPath);
    popupState.close();
  };

  const handleDownloadChrome = () => {
    downloadChrome(revision);
    popupState.close();
  };

  return (
    <div className={classes.chip}>
      <Tooltip title={revision}>
        <Chip
          color={isDownload ? 'primary' : 'default'}
          clickable
          label={version}
          {...bindTrigger(popupState)}
          className={classNames({
            downloading: revision === downloadingRevision,
          })}
        />
      </Tooltip>
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
        {isDownload ? (
          <ButtonGroup orientation="vertical" variant="contained">
            <Button onClick={handleOpenChrome} color="default">
              打开
            </Button>
            <Button onClick={handleDeleteChrome} color="secondary">
              删除
            </Button>
          </ButtonGroup>
        ) : (
          <Button
            onClick={handleDownloadChrome}
            color="primary"
            variant="contained"
          >
            下载
          </Button>
        )}
      </Popover>
    </div>
  );
};

export default DataChip;
