import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PATH_GENERAL } from '../../../../routes/paths'

Header.propTypes = {
  total: PropTypes.number.isRequired
};

export default function Header() {
  const history = useHistory();

  function onCreateCredential(evt) {
    evt.preventDefault();
    history.push(PATH_GENERAL.entities.add_credentials);
  }

  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Create Credentials'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'create credentials to access your assets'}
              </Typography>
              <LoadingButton
                type="submit"
                variant="contained"
                onClick={onCreateCredential}
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
