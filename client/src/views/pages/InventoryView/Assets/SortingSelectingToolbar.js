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
    <Grid p={2} container xs={12} direction={'row'}>
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
        <Grid container xs={8} direction="row" justifyContent="space-between">
          <Grid item xs={2}>
            <Select variant="outlined" fullWidth size="small" value={1}>
              <MenuItem value={1}>All Sites</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select variant="outlined" fullWidth size="small" value={1}>
              <MenuItem value={1}>All types</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select variant="outlined" fullWidth size="small" value={1}>
              <MenuItem value={1}>All models</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select variant="outlined" fullWidth size="small" value={1}>
              <MenuItem value={1}>All IOs</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
}
