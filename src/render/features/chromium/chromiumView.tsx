import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import LocalChromiumContainer from '../../stores/localChromium';

import ToolsFixedBtn from './ToolsFixedBtn';
import DataChip from './DataChip';
import CustomSearch from '../../components/CustomSearch';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(1),
      flexDirection: 'column',
      height: '100%',
    },
    toolbar: {
      display: 'inline-flex',
      alignItems: 'center',
    },
    spiderView: {
      marginRight: 80,
    },
    listContainer: {
      overflow: 'auto',
      flex: 1,
      padding: theme.spacing(1),
    },
    list: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  });
});

const ChromiumView = () => {
  const classes = useStyles();

  type State = {
    searchText: string;
    onlyShowDownloaded: boolean;
  };

  interface ChromiumData {
    revision: string;
    version: string;
    isDownload: boolean;
    executablePath: string;
    folderPath: string;
  }

  const [state, setState] = useState<State>({
    searchText: '',
    onlyShowDownloaded: false,
  });

  const {
    localChromiumData,
    GetLocalChromiumPaths,
    revisionToVersionMap,
  } = LocalChromiumContainer.useContainer();

  useEffect(() => {
    GetLocalChromiumPaths();
  }, [GetLocalChromiumPaths]);

  const { searchText, onlyShowDownloaded } = state;

  const setSearchText: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setState((pre) => {
        return {
          ...pre,
          searchText: e.target.value,
        };
      });
    },
    []
  );

  const setOnlyShowDownloaded: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setState((pre) => {
        return {
          ...pre,
          onlyShowDownloaded: e.target.checked,
        };
      });
    },
    []
  );

  const chromiumDataSource: ChromiumData[] = useMemo(() => {
    return Object.keys(revisionToVersionMap)
      .map((revision) => {
        const chromiumData = localChromiumData[revision];
        return {
          revision,
          version: revisionToVersionMap[revision],
          isDownload: chromiumData != null,
          executablePath: (chromiumData && chromiumData.executablePath) || '',
          folderPath: (chromiumData && chromiumData.folderPath) || '',
        };
      })
      .filter((data) => data.version !== 'error');
  }, [localChromiumData, revisionToVersionMap]);

  const searchedChromiumDataSource = useMemo(() => {
    return chromiumDataSource
      .filter((data) => data.version.includes(searchText))
      .filter((data) => {
        return !onlyShowDownloaded || data.isDownload;
      });
  }, [chromiumDataSource, searchText, onlyShowDownloaded]);

  return (
    <div className={classes.root}>
      <div>
        <div className={classes.toolbar}>
          <CustomSearch value={searchText} onChange={setSearchText} />
          <Switch
            checked={onlyShowDownloaded}
            onChange={setOnlyShowDownloaded}
          />
          <Typography>仅显示已下载</Typography>
        </div>

        <ToolsFixedBtn />
      </div>
      <div className={classes.listContainer}>
        <div className={classes.list}>
          {searchedChromiumDataSource.map((data) => {
            return <DataChip key={data.revision} {...data} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ChromiumView;
