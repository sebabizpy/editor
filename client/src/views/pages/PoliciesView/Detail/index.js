import { HeaderDashboard } from '../../../../layouts/Common';
import React from 'react';
import { Container } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Page from '../../../..//components/Page';
import { makeStyles } from '@material-ui/core/styles';
import FormView from './FormView';

const entities = (policyId) => `Policy ${policyId}`;
const title = (policyId) => `Policy ${policyId} | Bizpy`;

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

export default function DetailView() {
  const { policyId } = useParams();
  const classes = useStyles();
  return (
    <Page title={title(policyId)} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities(policyId)} />
        <FormView />
      </Container>
    </Page>
  );
}
