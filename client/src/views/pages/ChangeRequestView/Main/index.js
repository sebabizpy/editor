import { HeaderDashboard } from '../../../../layouts/Common';
import React from 'react';
import Main from './Main';
import { Container } from '@material-ui/core';
import Page from '../../../../components/Page';
import { makeStyles } from '@material-ui/core/styles';

const entities = 'Change Requests';
const title = 'Change Requests | Bizpy';

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
        <Main></Main>
      </Container>
    </Page>
  );
}
