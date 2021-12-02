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

  function onCreateGroup(evt) {
    evt.preventDefault();
    history.push(PATH_GENERAL.entities.groups_detail);
  }

  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Create Groups'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'create groups to define approvers and support groups to work on your assets'}
              </Typography>
              <LoadingButton
                style={{ margin: 3 }}
                type="submit"
                variant="contained"
                onClick={onCreateGroup}
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
