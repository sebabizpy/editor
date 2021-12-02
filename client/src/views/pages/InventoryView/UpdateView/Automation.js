import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import CountrySelect from '../../../../custom_components/CountrySelect';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

Automation.propTypes = {
  getFieldProps: PropTypes.func,
  formik: PropTypes.object
};

function Automation({ getFieldProps, formik }) {
  const { currentAsset } = useSelector((state) => state.asset);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} padding={2}>
            <Grid item>
              <Typography variant="h6" paragraph={true}>
                {'Automation'}
              </Typography>
              <TextField
                sx={{ m: 1 }}
                size="small"
                error={formik.touched.name && formik.errors.name ? true : false}
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ''
                }
                id={'name'}
                fullWidth
                label="Name"
                {...getFieldProps('name')}
              />

              <Grid item>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  error={
                    formik.touched.net_address && formik.errors.net_address
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.net_address && formik.errors.net_address
                      ? formik.errors.net_address
                      : ''
                  }
                  label="Network Address"
                  {...getFieldProps('net_address')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} padding={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" paragraph={true}>
                {'Location'}
              </Typography>
              <CountrySelect />
            </Grid>
            <Grid container spacing={1} xs={12} sm={12} direction="row">
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Floor"
                  {...getFieldProps('floor')}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Room"
                  {...getFieldProps('room')}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  sx={{ m: 1 }}
                  size="small"
                  fullWidth
                  label="Rack"
                  {...getFieldProps('rack')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Automation;
