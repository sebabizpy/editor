import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PATH_GENERAL, PATH_REMEDIATION } from '../../../../routes/paths'
import { ROLE, RoleValidator } from '../../../../custom_components/UserHelper';
import useAuth from '../../../../hooks/useAuth';

Header.propTypes = {
  total: PropTypes.number
};

export default function Header() {
  const history = useHistory();

  function onChangeChangeRequest(evt) {
    evt.preventDefault()
    history.push(PATH_REMEDIATION.remediation.create_change_requests);
  }
  const { user } = useAuth();

  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Create Change Requests'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'create change requests to track the work done to your assets'}
              </Typography>
              <RoleValidator user={user} minRole={ROLE.engineer}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  onClick={onChangeChangeRequest}
                >
                  {'Create'}
                </LoadingButton>
              </RoleValidator>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
