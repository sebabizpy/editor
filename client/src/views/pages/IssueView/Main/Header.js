import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PATH_REMEDIATION } from '../../../../routes/paths'
import { ROLE , RoleValidator } from '../../../../custom_components/UserHelper';
import useAuth from '../../../../hooks/useAuth';

Header.propTypes = {
  total: PropTypes.number.isRequired
};

export default function Header() {
  const history = useHistory();

  function onCreateCredential(evt) {
    evt.preventDefault();
    history.push(PATH_REMEDIATION.remediation.create_issues);
  }
  const { user } = useAuth();

  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Create Non Compliant Issues'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'create non compliant issue to track your changes'}
              </Typography>
              <RoleValidator user={user} minRole={ROLE.engineer}>
                <LoadingButton
                  style={{ margin: 3 }}
                  type="submit"
                  variant="contained"
                  onClick={onCreateCredential}
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
