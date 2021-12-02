import clsx from 'clsx';
import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { savePolicy } from '../../../../redux/slices/policies';
import { useSnackbar } from 'notistack';
import Detail from './Detail'

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

FormView.propTypes = {
  className: PropTypes.string,
  currentPolicy: PropTypes.string
};

function FormView({ className }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: '',
      severity: '',
      command: '',
      text_count: '',
      when: ''
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Enter the description').max(50),
      severity: Yup.string().required('Enter the severity'),
      command: Yup.string().required('Enter the command'),
      text_count: Yup.number().required('Enter the text count'),
      when: Yup.boolean().required('This command should match or not?'),
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      function callOnSubmitted(ok) {
        if (ok) {
          enqueueSnackbar('Policy Created', { variant: 'success' });
          resetForm({});
        }
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }

      try {
        setSubmitting(true);
        const vals = {
          description: values.description,
          severity: values.severity,
          command: values.command,
          text_count: values.text_count,
          when: values.when,
        };

        dispatch(savePolicy(vals, callOnSubmitted));
      } catch (error) {
        callOnSubmitted(false);
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
              <Detail formik={formik} getFieldProps={getFieldProps} />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                >
                  {'Add Policy'}
                </LoadingButton>
              </Box>
            </CardContent>
          </Card>
        </Form>
      </FormikProvider>
    </div >
  );
}

export default FormView;
