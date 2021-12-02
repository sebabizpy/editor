import FormView from './FormView';
import { Icon } from '@iconify/react';
import Page from '../../../../components/Page';
import React, { useState } from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Tab, Box, Tabs } from '@material-ui/core';

export const search = 'Search';
export const entities = 'New Asset';
export const entity = 'Asset';
export const edit = 'Edit';
export const title = 'Asset | Bizpy.io';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

// ----------------------------------------------------------------------

function BulkLoadView() {
  const classes = useStyles();
  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={'Bulk Asset Upload'} />
        <FormView></FormView>
      </Container>
    </Page>
  );
}

export default BulkLoadView;
