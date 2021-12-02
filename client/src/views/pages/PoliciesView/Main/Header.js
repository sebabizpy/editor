import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PATH_NETWORK_AUDIT } from '../../../../routes/paths'

Header.propTypes = {
  total: PropTypes.number.isRequired
};

export default function Header() {
  const history = useHistory();

  function onCreatePolicy(evt) {
    evt.preventDefault();
    history.push(PATH_NETWORK_AUDIT.audit.addPolicy);
  }

  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Create Policies'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'create policies to check your assets'}
              </Typography>
              <LoadingButton
                style={{ margin: 3 }}
                type="submit"
                variant="contained"
                onClick={onCreatePolicy}
              >
                {'Create'}
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
