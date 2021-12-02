import {
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import CustomTextField from '../../../../custom_components/CustomTextField';

Vendor.propTypes = {
  currentAsset: PropTypes.object
};

function Vendor({ currentAsset }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} padding={2}>
            <Typography variant="h6" paragraph={true}>
              {'Device'}
            </Typography>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  value={currentAsset.vendor || ''}
                  label={"Vendor"}
                  readOnly={true} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField value={currentAsset.devicetype || ''}
                  label={"Device Type"}
                  readOnly={true} />
              </Grid>
              <Grid item xs={12} sm={4}>
              <CustomTextField value={currentAsset.productSeries || ''}
                  label={"Series"}
                  readOnly={true} />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={12} sm={6}>
                <CustomTextField value={currentAsset.model || ''}
                  label={"Model"}
                  readOnly={true} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField value={currentAsset.serialNumber || ''}
                  label={"Serial Number"}
                  readOnly={true} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} padding={2}>
            <Typography variant="h6" paragraph={true}>
              {'OS'}
            </Typography>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <CustomTextField value={currentAsset.softwareType || ''}
                  label={"Software Type"}
                  readOnly={true} />
              </Grid>
              <Grid item xs={6} sm={6}>
                <CustomTextField value={currentAsset.osVersion || ''}
                  label={"Runnung Version"}
                  readOnly={true} />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <CustomTextField value={currentAsset.lastSwRelease || ''}
                  label={"Suggested Version"}
                  readOnly={true} />
              </Grid>
              <Grid item xs={6} sm={6}>
                <CustomTextField 
                  value={currentAsset?.lastSwReleaseDate ? new Date(currentAsset?.lastSwReleaseDate).toDateString() : 'N/A'}
                  label={"Suggested Version Release Date"}
                  readOnly={true} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Vendor;
