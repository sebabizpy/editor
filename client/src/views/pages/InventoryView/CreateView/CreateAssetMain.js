import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core';
import CountrySelect from '../../../../custom_components/CountrySelect';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ROLE } from '../../../../custom_components/UserHelper';
import { useSelector, useDispatch } from 'react-redux';
import { getCredentialsList } from '../../../../redux/slices/credential';
import { getGroupsList } from '../../../../redux/slices/group';

CreateAssetMain.propTypes = {
  getFieldProps: PropTypes.func,
  formik: PropTypes.object
};

function CreateAssetMain({ getFieldProps, formik }) {
  const dispatch = useDispatch();
  const { credentialList } = useSelector((state) => state.credential);
  const { groupList } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getCredentialsList());
    dispatch(getGroupsList());
  }, [dispatch]);

  return (
    <Card>
      <CardContent>
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
                error={formik.touched.name && formik.errors.name ? true : false}
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ''
                }
                inputProps={{ autoComplete: 'one-time-code' }}
                id={'name'}
                fullWidth
                label="Name"
                {...getFieldProps('name')}
              />
              <Grid container xs={12} sm={12} direction="row">
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{ m: 1, pl: 1 }}
                    fullWidth
                    size="small"
                    error={
                      formik.touched.host && formik.errors.host ? true : false
                    }
                    helperText={
                      formik.touched.host && formik.errors.host
                        ? formik.errors.host
                        : ''
                    }
                    inputProps={{ autoComplete: 'one-time-code' }}
                    label="Network Address"
                    {...getFieldProps('host')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    select
                    label={'Credential'}
                    sx={{ m: 1, pl: 1 }}
                    error={(formik.touched.credential && formik.errors.credential) ? true : false}
                    helperText={
                      (formik.touched.credential && formik.errors.credential) ? formik.errors.credential : ''
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
                      fullWidth
                      size="small"
                      select
                      label={'Owners Group'}
                      sx={{ m: 1, pl: 1 }}
                      error={(formik.touched.ownersGroup && formik.errors.ownersGroup) ? true : false}
                      helperText={
                        (formik.touched.ownersGroup && formik.errors.ownersGroup) ? formik.errors.ownersGroup : ''
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
                      fullWidth
                      size="small"
                      select
                      label={'Support Group'}
                      sx={{ m: 1, pl: 1 }}
                      error={(formik.touched.supportGroup && formik.errors.supportGroup) ? true : false}
                      helperText={
                        (formik.touched.supportGroup && formik.errors.supportGroup) ? formik.errors.supportGroup : ''
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
              {'Detail'}
            </Typography>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ m: 1, pl: 1 }}
                  size="small"
                  fullWidth
                  label="Site"
                  error={(formik.touched.site && formik.errors.site) ? true : false}
                  helperText={
                    (formik.touched.site && formik.errors.site) ? formik.errors.site : ''
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
                    fullWidth
                    label="Floor"
                    {...getFieldProps('floor')}
                  />
                </Grid>
                <Grid item xs={4} sm={4}>
                  <TextField
                    sx={{ m: 1, pl: 1 }}
                    size="small"
                    fullWidth
                    label="Room"
                    {...getFieldProps('room')}
                  />
                </Grid>
                <Grid item xs={4} sm={4}>
                  <TextField
                    sx={{ m: 1, pl: 1 }}
                    size="small"
                    fullWidth
                    label="Rack"
                    {...getFieldProps('rack')}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CreateAssetMain;
