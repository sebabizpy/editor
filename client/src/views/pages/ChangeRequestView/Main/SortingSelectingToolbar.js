import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Typography, Grid, Hidden, TextField, IconButton } from '@material-ui/core';
import { SearchDialog } from '../../../../custom_components/SearchDialog';
import AssetSearch from '../../InventoryView/Assets/Main';
import searchIcon from '@iconify-icons/eva/search-fill';
import { Icon } from '@iconify/react';

SortingSelectingToolbar.propTypes = {
  total: PropTypes.number.isRequired,
  onSelectedRow: PropTypes.func.isRequired,
  asset: PropTypes.object,
  onClose: PropTypes.object,
  setOpen: PropTypes.func.isRequired
};

export default function SortingSelectingToolbar({ total, onSelectedRow, asset, setOpen, open }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Grid p={2} container direction={'row'}>
      <SearchDialog open={open} onClose={onClose}>
        <AssetSearch key={1} editing={false} onSelectRow={onSelectedRow} />
      </SearchDialog>
      <Grid item xs={4} alignItems={'center'}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: isLight ? 'primary.main' : 'text.primary'
          }}
        >
          {total} Results
        </Typography>
      </Grid>
      <Hidden mdDown>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <TextField
              sx={{ m: 1 }}
              size="small"
              fullWidth
              type={'text'}
              label="Asset"
              value={asset?.name || ''}
              InputProps={{
                tabIndex: '3', endAdornment: <IconButton
                  onClick={() => setOpen(true)}
                  color={open ? 'primary' : 'default'}
                >
                  <Icon icon={searchIcon} width={20} height={20} />
                </IconButton>
              }}
            />
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
}
