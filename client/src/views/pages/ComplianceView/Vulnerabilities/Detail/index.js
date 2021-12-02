import { HeaderDashboard } from '../../../../../layouts/Common';
import React from 'react';
import Detail from './Detail';
import { Container } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/core/styles';

const entities = (policyId) => `Policy ${policyId}`;
const title = (policyId) => `Bizpy.io |Policy ${policyId} `;

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
        <Detail />
      </Container>
    </Page>
  );
}
