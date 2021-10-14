import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  alpha,
} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    search: {
      position: 'relative',
      display: 'inline-block',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.primary.light, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: 200,
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        maxWidth: 200,
        width: 'auto',
      },
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  });
});

interface CustomSearchProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const CustomSearch: React.FC<CustomSearchProps> = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomSearch;
