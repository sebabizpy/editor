import { HeaderDashboard } from '../../../../layouts/Common';
import React from 'react';
import Main from './Main';
import { Container } from '@material-ui/core';
import Page from '../../../../components/Page';
import { makeStyles } from '@material-ui/core/styles';
import { title } from '../DetailView';
const entities = 'Groups';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

export default function MainView() {
  const classes = useStyles();
  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
          heading="Account"
        <Main></Main>
      </Container>
    </Page>
  );
}
