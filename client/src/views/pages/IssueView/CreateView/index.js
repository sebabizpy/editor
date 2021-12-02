import FormView from './FormView';
import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
export const search = 'Search';
export const entities = 'Create Issue';
export const entity = 'Issue';
export const edit = 'Edit';
export const title = 'Bizpy.io | Issue';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function IssueDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView ></FormView>
      </Container>
    </Page>
  );
}

export default IssueDetailView;
