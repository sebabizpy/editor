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
    <Grid container p={2} spacing={2} direction="row" justifyContent="space-between">
      <Grid item xs={8}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: isLight ? 'primary.main' : 'text.primary'
          }}
        >
          {total} Results
        </Typography></Grid>
      <Hidden mdDown>
        <Grid item xs={2}>
          <Select variant="outlined" fullWidth size="small" value={1}>
            <MenuItem value={1}>All Severities</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Select variant="outlined" fullWidth size="small" value={1}>
            <MenuItem value={1}>All Policies</MenuItem>
          </Select>
        </Grid>
      </Hidden>
    </Grid>

  );
}
