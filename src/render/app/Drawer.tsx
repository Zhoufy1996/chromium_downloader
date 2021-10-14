/* eslint-disable @typescript-eslint/ban-types */
import React, { useState, useMemo } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory, useLocation } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import { ipcRenderer } from 'electron';
import menuConfig from './MenuConfig';

interface State {
  open: boolean;
}

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      height: '100%',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    toolbar: {
      justifyContent: 'space-between',
    },
    toolbarLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    actionButtons: {
      float: 'right',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: theme.spacing(1),
      ...theme.mixins.toolbar,
    },
    content: {
      marginTop: 64,
      width: '100%',
      marginLeft: -drawerWidth,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: 0,
    },
  });
});

const CustomDrawer: React.FC<{}> = ({ children }) => {
  const [state, setState] = useState<State>({
    open: false,
  });

  const { open } = state;

  const classes = useStyles();

  const handleDrawerClose = () => {
    setState({
      open: false,
    });
  };

  const handleDrawerOpen = () => {
    setState({
      open: true,
    });
  };

  const { pathname } = useLocation();

  const history = useHistory();
  const title = useMemo(() => {
    const menu = menuConfig.find((item) => {
      return item.path === pathname;
    });
    return (menu && menu.title) || '';
  }, [pathname]);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        color="primary"
        className={classNames([classes.appBar], 'drag-header', {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.toolbarLeft}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className={classNames([classes.menuButton], {
                [classes.hide]: open,
              })}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">{title}</Typography>
          </div>

          <div>
            <IconButton
              onClick={() => {
                ipcRenderer.send('hide');
              }}
              color="inherit"
              aria-label="minimize"
              edge="start"
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                ipcRenderer.send('close');
              }}
              color="inherit"
              aria-label="close"
              edge="start"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton aria-label="" onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menuConfig.map((item) => {
            return (
              <ListItem
                button
                onClick={() => {
                  history.push(item.path);
                }}
                key={item.path}
              >
                <ListItemText primary={item.title} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <main
        className={classNames(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {children}
      </main>
    </div>
  );
};

export default CustomDrawer;
