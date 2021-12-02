import clsx from 'clsx';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { saveAsset, startLoading } from 'src/redux/slices/assets';
import CreateAssetMain from './../CreateView/CreateAssetMain';
import Automation from './Automation';
import MgmtInformation from './MgmtInformation';
import Progress from '../../../../custom_components/Progress';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

FormView.propTypes = {
  className: PropTypes.string,
  currentAsset: PropTypes.string
};

function FormView({ className, currentAsset }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();

  const { currentStatus } = useSelector((state) => state.automation);
  // const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      net_address: '',
      floor: '',
      room: '',
      rack: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Enter the name').max(50),
      net_address: Yup.string().required('Enter the network address')
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);

        const vals = {
          host: values.net_address,
          name: values.name,
          floor: values.floor,
          pass: values.room,
          protocol: 'Argentina'
        };
        dispatch(saveAsset(vals));
        // TODO: revisar aca falla el back y cagaste.
        //resetForm({});
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    }
  });
  const { isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box flexDirection="column">
                <Progress
                  value={currentStatus.percent}
                  label={currentStatus.label}
                />
                <Box sx={{ mt: 3 }}>
                  <CreateAssetMain
                    getFieldProps={getFieldProps}
                    formik={formik}
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Automation getFieldProps={getFieldProps} formik={formik} />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <MgmtInformation currentAsset={currentAsset} />
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                >
                  {'Add Asset'}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default FormView;
