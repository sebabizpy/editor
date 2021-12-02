import { Grid, TextField, Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

Detail.propTypes = {
  formik: PropTypes.object,
  getFieldProps: PropTypes.func
};

export default function Detail({ formik, getFieldProps }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} padding={2}>
        <Grid item>
          <Typography variant="h6" paragraph={true}>
            {'Detail'}
          </Typography>
          <TextField
            autoComplete="one-time-code"
            sx={{ m: 1 }}
            size="small"
            error={formik.touched.description && formik.errors.description ? true : false}
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : ''
            }
            inputProps={{ autoComplete: 'one-time-code' }}
            id={'description'}
            fullWidth
            label="Description"
            {...getFieldProps('description')}
          />
          <Grid item xs={12} sm={12}>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              error={
                formik.touched.severity && formik.errors.severity ? true : false
              }
              helperText={
                formik.touched.severity && formik.errors.severity
                  ? formik.errors.severity
                  : ''
              }
              inputProps={{ autoComplete: 'one-time-code' }}
              label="Severity"
              {...getFieldProps('severity')}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} padding={2}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" paragraph={true}>
            {'Check'}
          </Typography>
        </Grid>
        <Grid container  xs={12} sm={12} direction="row">
          <Grid item xs={12} sm={12}>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              error={
                formik.touched.command && formik.errors.command ? true : false
              }
              helperText={
                formik.touched.command && formik.errors.command
                  ? formik.errors.command
                  : ''
              }
              inputProps={{ autoComplete: 'one-time-code' }}
              label="Command"
              {...getFieldProps('command')}
            />
          </Grid>
          <Grid container spacing={1} xs={12} sm={12} direction="row">
            <Grid item xs={6} sm={6}>
              <TextField
                sx={{ m: 1 }}
                size="small"
                fullWidth
                error={
                  formik.touched.text_count && formik.errors.text_count ? true : false
                }
                helperText={
                  formik.touched.text_count && formik.errors.text_count
                    ? formik.errors.text_count
                    : ''
                }
                inputProps={{ autoComplete: 'one-time-code' }}
                label="Text Count"
                {...getFieldProps('text_count')}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                sx={{ m: 1 }}
                size="small"
                fullWidth
                error={
                  formik.touched.when && formik.errors.when ? true : false
                }
                helperText={
                  formik.touched.when && formik.errors.when
                    ? formik.errors.when
                    : ''
                }
                inputProps={{ autoComplete: 'one-time-code' }}
                label="Should match"
                {...getFieldProps('when')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
