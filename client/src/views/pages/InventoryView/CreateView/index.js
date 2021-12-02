import FormView from './FormView';
import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';

export const search = 'Search';
export const entities = 'New Asset';
export const entity = 'Asset';
export const edit = 'Edit';
export const title = 'Bizpy.io | Asset';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function DiscoveryView() {
  const classes = useStyles();

  // el asset que estoy usando.
  const { currentAsset } = useSelector((state) => state.asset);

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView currentAsset={currentAsset}></FormView>
      </Container>
    </Page>
  );
}

export default DiscoveryView;
