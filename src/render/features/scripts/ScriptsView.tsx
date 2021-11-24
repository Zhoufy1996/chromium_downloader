import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import ProjectOpenView from './ProjectOpen';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
    },
  });
});

const ScriptsView = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ProjectOpenView />
    </div>
  );
};

export default ScriptsView;
