import clsx from 'clsx';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { saveCredential } from '../../../../redux/slices/credential';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

FormView.propTypes = {
  className: PropTypes.string,
  currentCredential: PropTypes.string
};

function FormView({ className }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [id, setId] = useState();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: '',
      protocol: '',
      pass_1: '',
      pass_2: ''
    },
    validationSchema: Yup.object({
      user: Yup.string().required('Enter the username').max(50),
      pass_1: Yup.string().required('Enter the password'),
      pass_2: Yup.string().required('Repeat the password')
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      function callOnSubmitted() {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }

      try {
        setSubmitting(true);

        if (values.pass_1 !== values.pass_2) {
          setErrors({
            pass_1: 'Enter the same password',
            pass_2: 'Enter the same password'
          });
        } else {
          const vals = {
            id: id,
            user: values.user,
          };

          dispatch(saveCredential(vals, callOnSubmitted));
          resetForm({});
          enqueueSnackbar('Credential Created', { variant: 'success' });
        }
      } catch (error) {
        callOnSubmitted();
      }
    }
  });

  const { isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        error={
                          formik.touched.user && formik.errors.user
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.user && formik.errors.user
                            ? formik.errors.user
                            : ''
                        }
                        id={'user'}
                        fullWidth
                        label="User"
                        inputProps={{ tabIndex: '1' }}
                        {...getFieldProps('user')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Select
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={1}
                        inputProps={{ tabIndex: '2' }}
                      >
                        <MenuItem value={1}>SSH</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        inputProps={{ tabIndex: '3' }}
                        type={'password'}
                        error={
                          formik.touched.pass_1 && formik.errors.pass_1
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.pass_1 && formik.errors.pass_1
                            ? formik.errors.pass_1
                            : ''
                        }
                        label="Password"
                        {...getFieldProps('pass_1')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        inputProps={{ tabIndex: '4' }}
                        type={'password'}
                        label="Repeat the password"
                        {...getFieldProps('pass_2')}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      pending={isSubmitting}
                    >
                      {'Create'}
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default FormView;
