import FormView from './FormView';
import { Icon } from '@iconify/react';
import Page from '../../../../components/Page';
import React, { useState } from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Tab, Box, Tabs } from '@material-ui/core';
import Search from '../SearchView/Search';

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

function AssetDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.
  //const { currentAsset } = useSelector((state) => state.asset);
  let currentAsset = {
    name: 'Router CSR1000V',
    uptime: 72960,
    vendor: 'Cisco',
    os: 'Virtual XE Software (X86_64_LINUX_IOSD-UNIVERSALK9-M)',
    osVersion: '17.3.1a, RELEASE SOFTWARE (fc3)',
    serialNumber: '9ESGOBARV9D',
    model: 'CSR1000V',
    hostname: 'csr1000v-1',
    device: 'C9300-24P',
    releaseDate: '04-Mar-2021',
    releaseFormat: '17.3.3',
    endOfSaleDate: '19/02/78',
    lastDateOfSupport: '19/02/78',
    endOfSWMaintenanceReleases: 'IOS XE Software',
    migrationStrategy: 'IOS XE Software'
  };

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={currentAsset.name} />
        <FormView currentAsset={currentAsset}></FormView>
      </Container>
    </Page>
  );
}

export default AssetDetailView;
