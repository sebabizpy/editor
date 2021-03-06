import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import fakeRequest from '../../../utils/fakeRequest';
import { useFormik, Form, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Switch,
  FormGroup,
  Typography,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

const ACTIVITY_OPTIONS = [
  {
    value: 'activityComments',
    label:  'Notify by email'
  },
  {
    value: 'activityAnswers',
    label: 'Notify by WhatsApp'
  },
  { value: 'activityFollows', label: 'Notify by text messages' }
];

const APPLICATION_OPTIONS = [
  { value: 'applicationNews', label: 'Alerts' },
  { value: 'applicationProduct', label: 'Approvals' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

Notifications.propTypes = {
  notifications: PropTypes.object,
  className: PropTypes.string
};

function Notifications({ notifications, className }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      activityComments: true,
      activityAnswers: false,
      activityFollows: true,
      applicationNews: true,
      applicationProduct: true,
      applicationBlog: true
    },
    onSubmit: async (values, { setSubmitting }) => {
      await fakeRequest(500);
      setSubmitting(false);
      alert(JSON.stringify(values, null, 2));
      enqueueSnackbar('Save success', { variant: 'success' });
    }
  });

  const { values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <FormGroup>
            <Typography
              paragraph
              variant="overline"
              sx={{ color: 'text.secondary' }}
            >
              Channels
            </Typography>
            {ACTIVITY_OPTIONS.map((activity) => (
              <FormControlLabel
                key={activity.value}
                control={
                  <Switch
                    {...getFieldProps(activity.value)}
                    checked={values[activity.value]}
                  />
                }
                label={activity.label}
              />
            ))}
          </FormGroup>

          <Box sx={{ mt: 3, mb: 5 }}>
            <FormGroup>
              <Typography
                paragraph
                variant="overline"
                sx={{ color: 'text.secondary' }}
              >
                Application
              </Typography>
              {APPLICATION_OPTIONS.map((item) => (
                <FormControlLabel
                  key={item.value}
                  control={
                    <Switch
                      {...getFieldProps(item.value)}
                      checked={values[item.value]}
                    />
                  }
                  label={item.label}
                />
              ))}
            </FormGroup>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              pending={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Box>
        </Form>
      </FormikProvider>
    </Card>
  );
}

export default Notifications;
