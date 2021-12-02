import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import CountrySelect from '../../../../custom_components/CountrySelect';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getCredentialsList } from '../../../../redux/slices/credential';
import { getGroupsList } from '../../../../redux/slices/group';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import { patchAsset } from '../../../../redux/slices/assets'


ShowAssetMain.propTypes = {
  currentAsset: PropTypes.object
};


function ShowAssetMain({ currentAsset }) {

  const dispatch = useDispatch();
  const { credentialList } = useSelector((state) => state.credential);
  const { groupList } = useSelector((state) => state.group);
  const isMountedRef = useIsMountedRef((state) => state.group);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getCredentialsList());
    dispatch(getGroupsList());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentAsset?.name ? currentAsset.name : '',
      ipAddress: currentAsset?.ipAddress ? currentAsset.ipAddress : '',
      credential: currentAsset?.credential?.id ? currentAsset.credential.id : '',
      ownersGroup: currentAsset?.ownersGroup?.id ? currentAsset.ownersGroup.id : '',
      supportGroup: currentAsset?.supportGroup?.id ? currentAsset.supportGroup.id : '',
      site: currentAsset?.site ? currentAsset.site : '',
      floor: currentAsset?.floor ? currentAsset.floor : '',
      room: currentAsset?.room ? currentAsset.room : '',
      rack: currentAsset?.rack ? currentAsset.rack : '',
      country: currentAsset?.country ? currentAsset.country : '',
    },

    validationSchema: Yup.object({
      name: Yup.string().required('Enter the username').max(50),
      ipAddress: Yup.string().required('Enter the password'),
      credential: Yup.string().required('Select a credential'),
      ownersGroup: Yup.string().required('Select a Owners Group'),
      supportGroup: Yup.string().required('Select a Support Group '),
      country: Yup.string().required('Select a Country '),
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {

      function callOnSubmitted(ok) {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        if (ok) {
          resetForm();
          enqueueSnackbar('Asset Updated', { variant: 'success' });
        }
      }

      try {
        setSubmitting(true);
        values['id'] = currentAsset?.id
        dispatch(patchAsset(values, callOnSubmitted));

      } catch (error) {
        callOnSubmitted();
      }
    }
  });

  const { isSubmitting, handleSubmit, getFieldProps, dirty } = formik;
  return (
    <Card>
      <CardContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit} >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} padding={2}>
                <Grid item>
                  <Typography variant="h6" paragraph={true}>
                    {'Detail'}
                  </Typography>
                  <TextField
                    autoComplete="one-time-code"
                    sx={{ m: 1, pl: 1 }}
                    size="small"
                    inputProps={{ autoComplete: 'one-time-code' }}
                    id={'name'}
                    fullWidth disabled
                    label="Name"
                    helperText={
                      formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : ''
                    }
                    {...getFieldProps('name')}
                  />
                  <Grid container xs={12} sm={12} direction="row">
                    <Grid item xs={12} sm={6}>
                      <TextField
                        sx={{ m: 1, pl: 1 }}
                        fullWidth disabled
                        size="small"
                        inputProps={{ autoComplete: 'one-time-code' }}
                        label="Host"
                        helperText={
                          formik.touched.ipAddress && formik.errors.ipAddress
                            ? formik.errors.ipAddress
                            : ''
                        }
                        {...getFieldProps('ipAddress')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth disabled
                        size="small"
                        select
                        label={'Credential'}
                        sx={{ m: 1, pl: 1 }}
                        helperText={
                          formik.touched.credential && formik.errors.credential
                            ? formik.errors.credential
                            : ''
                        }
                        {...getFieldProps('credential')}
                      >
                        {credentialList.map(function (credential, idx) {
                          return (
                            <MenuItem id={idx} value={credential.id}>
                              {credential.user}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid container xs={12} sm={12} direction="row">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          fullWidth disabled
                          size="small"
                          select
                          label={'Owners Group'}
                          sx={{ m: 1, pl: 1 }}
                          helperText={
                            formik.touched.ownersGroup && formik.errors.ownersGroup
                              ? formik.errors.ownersGroup
                              : ''
                          }
                          {...getFieldProps('ownersGroup')}
                        >
                          {groupList.map(function (group, idx) {
                            return (
                              <MenuItem id={idx} value={group.id}>
                                {group.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          fullWidth disabled
                          size="small"
                          select
                          label={'Support Group'}
                          sx={{ m: 1, pl: 1 }}
                          helperText={
                            formik.touched.supportGroup && formik.errors.supportGroup
                              ? formik.errors.supportGroup
                              : ''
                          }
                          {...getFieldProps('supportGroup')}
                        >
                          {groupList.map(function (group, idx) {
                            return (
                              <MenuItem id={idx} value={group.id}>
                                {group.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} padding={2}>
                <Typography variant="h6" paragraph={true}>
                  {'Location'}
                </Typography>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      sx={{ m: 1, pl: 1 }}
                      size="small"
                      fullWidth disabled
                      label="Site"
                      helperText={
                        formik.touched.site && formik.errors.site
                          ? formik.errors.site
                          : ''
                      }
                      {...getFieldProps('site')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CountrySelect formik={formik} getFieldProps={getFieldProps} fieldName={'country'} />
                  </Grid>
                  <Grid container xs={12} sm={12} direction="row">
                    <Grid item xs={4} sm={4}>
                      <TextField
                        sx={{ m: 1, pl: 1 }}
                        size="small"
                        fullWidth disabled
                        label="Floor"
                        helperText={
                          formik.touched.floor && formik.errors.floor
                            ? formik.errors.floor
                            : ''
                        }
                        {...getFieldProps('floor')}
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <TextField
                        sx={{ m: 1, pl: 1 }}
                        size="small"
                        fullWidth disabled
                        label="Room"
                        helperText={
                          formik.touched.room && formik.errors.room
                            ? formik.errors.room
                            : ''
                        }
                        {...getFieldProps('room')}
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <TextField
                        sx={{ m: 1, pl: 1 }}
                        size="small"
                        fullWidth disabled
                        label="Rack"
                        helperText={
                          formik.touched.rack && formik.errors.rack
                            ? formik.errors.rack
                            : ''
                        }
                        {...getFieldProps('rack')}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                onClick= { () =>{
                  console.log(`Formik Errors ${JSON.stringify(formik.errors)}`)
                }}
                disabled={!dirty}
                pending={isSubmitting}
              >
                {'Update Fields'}
              </LoadingButton>
            </Box> */}
          </Form>
        </FormikProvider>
      </CardContent>
    </Card>
  );
}

export default ShowAssetMain;
