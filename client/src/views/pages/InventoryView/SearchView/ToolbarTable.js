import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify-icons/eva/search-fill';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, OutlinedInput } from '@material-ui/core';
import { entities } from '../CreateView';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';
  return {
    root: {
      height: 96,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1, 0, 3)
    },
    search: {
      width: 240,
      transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
      }),
      '&.Mui-focused': { width: 320, boxShadow: theme.shadows[25].z8 },
      '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`
      }
    },
    highlight: isLight
      ? {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.lighter
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark
        }
  };
});

// ----------------------------------------------------------------------

ToolbarTable.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  className: PropTypes.string
};

function ToolbarTable({ filterName, onFilterName, className }) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = React.useState('');

  function onChangeSearchString(event) {
    setSearchValue(event.target.value);
  }

  function onKeyPress(e) {
    if (e.keyCode === 13) {
      onFilterName(searchValue);
    }
  }

  function onClickSearch(event) {
    onFilterName(searchValue);
  }

  return (
    <Toolbar className={clsx(classes.root, className)}>
      <OutlinedInput
        value={searchValue}
        onKeyDown={onKeyPress}
        onChange={onChangeSearchString}
        placeholder={`Buscar ${entities.toLowerCase()}...`}
        endAdornment={
          <IconButton onClick={onClickSearch}>
            <Icon icon={searchFill} />
          </IconButton>
        }
        className={classes.search}
      />
    </Toolbar>
  );
}

export default ToolbarTable;
