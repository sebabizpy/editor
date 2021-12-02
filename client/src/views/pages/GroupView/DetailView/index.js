import FormView from './FormView';
import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
export const search = 'Search';
export const entities = 'New Group';
export const entity = 'Group';
export const edit = 'Edit';
export const title = 'Bizpy | Groups';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function GroupDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.
  const { currentGroup } = useSelector((state) => state.group);

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView currentGroup={currentGroup}></FormView>
      </Container>
    </Page>
  );
}

export default GroupDetailView;
