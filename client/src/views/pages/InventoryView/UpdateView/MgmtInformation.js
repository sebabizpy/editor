import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

MgmtInformation.propTypes = {
  currentAsset: PropTypes.object
};

function MgmtInformation({ currentAsset }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} padding={2}>
            <Typography variant="h6" paragraph={true}>
              {'Device'}
            </Typography>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Vendor"
                  value={currentAsset.vendor}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Device"
                  value={currentAsset.device}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Serial Number"
                  value={currentAsset.serialNumber}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Host name"
                  value={currentAsset.hostname}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Uptime"
                  value={currentAsset.uptime}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="End Of Sale Date"
                  value={currentAsset.endOfSaleDate}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Last Date Of Support"
                  value={currentAsset.lastDateOfSupport}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="End Of SW Maintenance Releases"
                  value={currentAsset.endOfSWMaintenanceReleases}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} padding={2}>
            <Typography variant="h6" paragraph={true}>
              {'OS'}
            </Typography>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Operating System"
                  value={currentAsset.softwareType}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Version"
                  value={currentAsset.os}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Version"
                  value={currentAsset.osVersion}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Version"
                  value={currentAsset.osVersion}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Version"
                  value={currentAsset.osVersion}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Migration Strategy"
                  value={currentAsset.migrationStrategy}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Uptime"
                  value={currentAsset.uptime}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MgmtInformation;
