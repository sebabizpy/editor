import FormView from './FormView';
import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
export const search = 'Search';
export const entities = 'New Credential';
export const entity = 'Credential';
export const edit = 'Edit';
export const title = 'Bizpy | Credentials';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function CredentialDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.
  const { currentCredential } = useSelector((state) => state.credential);

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView currentCredential={currentCredential}></FormView>
      </Container>
    </Page>
  );
}

export default CredentialDetailView;
