import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { onChangeStatus, saveAsset } from '../../../../redux/slices/assets';
import CreateAssetMain from './CreateAssetMain';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { PATH_ASSETS } from '../../../../routes/paths';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

FormView.propTypes = {
  className: PropTypes.string,
  currentAsset: PropTypes.string
};

function FormView({ className }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { changed } = useSelector((state) => state.asset);
  const history = useHistory();

  // TODO: add this isSubmitting submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (changed !== 'none') {
    enqueueSnackbar(`Asset ${changed}`, { variant: 'success' });
    dispatch(onChangeStatus('none'));
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      host: '',
      floor: '',
      site: '',
      supportGroup: '',
      ownersGroup: '',
      room: '',
      credential: '',
      country: '',
      rack: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Enter the name').max(50),
      host: Yup.string().required('Enter the network address'),
      site: Yup.string().required('Enter the site'),
      credential: Yup.number().required('Select the credential'),
      ownersGroup: Yup.number().required('Select the owner group'),
      supportGroup: Yup.number().required('Select the support group')
    }),

    onSubmit: async (values, { setErrors, resetForm }) => {

      function callOnSubmitted(ok) {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
        if (ok) {
          enqueueSnackbar('Asset created', { variant: 'success' });
          resetForm({});
          history.push(PATH_ASSETS.general.search);
        }
      }


      try {
        setIsSubmitting(true);

        const vals = {
          host: values.host,
          name: values.name,
          floor: values.floor,
          site: values.site,
          room: values.room,
          rack: values.rack,
          country: values.country,
          credential: { id: values.credential },
          ownersGroup: { id: values.ownersGroup },
          supportGroup: { id: values.supportGroup }
        };

        dispatch(saveAsset(vals, callOnSubmitted));
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  });
  const { handleSubmit, getFieldProps, setSubmitting } = formik;

  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <CreateAssetMain getFieldProps={getFieldProps} formik={formik} />
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
