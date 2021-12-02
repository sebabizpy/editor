import FormView from './FormView';
import Page from '../../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
export const search = 'Search';
export const entities = 'Comparing version 1 to 2 from Asset 1';
export const entity = 'Config';
export const edit = 'Edit';
export const title = 'Bizpy | Configs';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function ConfigDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.
  const { currentConfig } = useSelector((state) => state.config);

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView currentConfig={currentConfig}></FormView>
      </Container>
    </Page>
  );
}

export default ConfigDetailView;
