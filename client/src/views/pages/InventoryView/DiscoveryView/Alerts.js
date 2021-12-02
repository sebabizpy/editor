import {
  Grid
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import Affected from './Affected';
import Remediation from './Remediation';

Alerts.propTypes = {
  data: PropTypes.object
};

function Alerts({ data }) {


  return (
    <Grid container xs={12} sm={12} direction="row">
      <Grid item xs={12} sm={6} sx={{ pr: 1 }}>
        <Affected data={data.issues} />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ pl: 1 }}>
        <Remediation data={data.remediation} />
      </Grid>
    </Grid>
  );
}

export default Alerts;
