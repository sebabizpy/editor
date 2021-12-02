import {
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import CustomTextField from '../../../../custom_components/CustomTextField';

MgmtInformation.propTypes = {
  currentAsset: PropTypes.object
};

function MgmtInformation({ currentAsset }) {

  console.log(`currentAsset.eoxHardware ${currentAsset.eoxHardware}`);
  console.log(`new Date() toDateString ${new Date(currentAsset.eoxHardware).toDateString()}`);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} padding={2}>
            <Typography variant="h6" paragraph={true}>
              {'Maintenance'}
            </Typography>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  value={currentAsset?.isCovered ? "Covered" : 'Not Covered'}
                  label={'Covered'}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  value={currentAsset.contractNumber || 'N/A'}
                  label={'Contract Number'}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  value={currentAsset?.contractCustomerName || 'N/A'}
                  label={'Contract Customer Name'}
                  readOnly={true}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <CustomTextField
                  value={currentAsset?.warrantyEndDate ? new Date(currentAsset?.warrantyEndDate).toDateString() : 'N/A'}
                  label={'Warranty End Date'}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <CustomTextField
                  value={currentAsset?.coveredPLEndDate ? new Date(currentAsset?.coveredPLEndDate).toDateString() : 'N/A'}
                  label={"Covered Product Line End Date"}
                  readOnly={true} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} padding={2}>
            <Typography variant="h6" paragraph={true}>
              {'Asset Lifecycle'}
            </Typography>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  value={currentAsset?.eoxAnnouncement === 'YES' ? 'YES' : 'NO'}
                  label={'Announced'}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  value={currentAsset?.endOfSale ? new Date(currentAsset?.endOfSale).toDateString() : 'N/A'}
                  label={'End of Sale'}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  value={currentAsset?.lastDateOfSupport ? new Date(currentAsset?.lastDateOfSupport).toDateString() : 'N/A'}
                  label={'LDoS'}
                  readOnly={true}
                />
              </Grid>

            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={6} sm={6}>
                <CustomTextField
                  value={currentAsset?.eoxHardware ? new Date(currentAsset?.eoxHardware).toDateString() : 'N/A'}
                  label={'EOX Hardware'}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <CustomTextField
                  value={currentAsset?.eoxSoftware ? new Date(currentAsset?.eoxSoftware).toDateString() : 'N/A'}
                  label={'EOX Software'}
                  readOnly={true}
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
