import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Typography, Grid, Hidden, Select, MenuItem } from '@material-ui/core';

SortingSelectingToolbar.propTypes = {
  total: PropTypes.number.isRequired
};

export default function SortingSelectingToolbar({ total }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Grid p={2} container direction={'row'}>
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
            <Select variant="outlined" fullWidth size="small" value={1}>
              <MenuItem value={1}>All Roles</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
}
