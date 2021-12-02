import clsx from 'clsx';
import React from 'react';
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
  TextField
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { saveGroup, setGroupSelected } from '../../../../redux/slices/group';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { PATH_GENERAL } from '../../../../routes/paths';
import { current } from '@reduxjs/toolkit';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

FormView.propTypes = {
  className: PropTypes.string,
  currentGroup: PropTypes.string
};

function FormView({ className, currentGroup }) {

  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentGroup?.name ? currentGroup?.name : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Enter the group`s name').max(50),
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {

      function callOnSubmitted() {
        if (isMountedRef.current) {
          setSubmitting(false);
          resetForm({});
          enqueueSnackbar(`Group ${currentGroup ? 'Saved' : 'Created'}`, { variant: 'success' });
          history.push(PATH_GENERAL.entities.groups);
          dispatch(setGroupSelected(undefined));
        }
      }

      try {
        setSubmitting(true);
        const vals = {
          id: currentGroup?.id,
          name: values.name
        };
        dispatch(saveGroup(vals, callOnSubmitted));
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
                    <TextField
                      size="small"
                      sx={{ m: 1 }}
                      error={
                        formik.touched.name && formik.errors.name
                          ? true
                          : false
                      }
                      helperText={
                        formik.touched.name && formik.errors.name
                          ? formik.errors.name
                          : ''
                      }
                      id={'name'}
                      fullWidth
                      label="Name"
                      inputProps={{ tabIndex: '1' }}
                      {...getFieldProps('name')}
                    />
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      pending={isSubmitting}
                    >
                      {currentGroup ? 'Save' : 'Create'}
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
