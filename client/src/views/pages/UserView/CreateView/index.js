import React from 'react';
import FormView from './FormView';
import Page from '../../../../components/Page';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
export const search = 'Search';
export const entities = 'New User';
export const entity = 'User';
export const edit = 'Edit';
export const title = 'Bizpy.io | User';
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

// ----------------------------------------------------------------------

function UserDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView></FormView>
      </Container>
    </Page>
  );
}

export default UserDetailView;
