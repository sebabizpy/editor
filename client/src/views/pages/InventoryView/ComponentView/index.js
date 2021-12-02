import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import DetailViewT from '../Assets';

export const search = 'Search';
export const entities = 'Assets';
export const entity = 'Asset';
export const edit = 'Edit';
export const title = 'Bizpy.io | Asset';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function AssetSearchView() {
  const classes = useStyles();

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
            <h1>Componenets </h1>
      </Container>
    </Page>
  );
}

export default AssetSearchView;
