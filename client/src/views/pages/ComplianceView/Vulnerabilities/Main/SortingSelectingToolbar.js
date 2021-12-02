import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Typography, Grid, Hidden, Select, MenuItem } from '@material-ui/core';
import React from 'react';

SortingSelectingToolbar.propTypes = {
  total: PropTypes.number.isRequired
};

// TODO: this is all duplicated. SHould be unified across pages.

export default function SortingSelectingToolbar({ total }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Grid p={2} container direction="row" justifyContent="space-between">
      <Grid item xs={4}>
        <Typography
          alignItems={'center'}
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
        <Grid item xs={4}>
          <Select variant="outlined" fullWidth size="small" value={1}>
            <MenuItem value={1}>All status</MenuItem>
          </Select>
        </Grid>
      </Hidden>
    </Grid>
  );
}
