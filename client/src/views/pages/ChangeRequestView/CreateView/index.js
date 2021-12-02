import FormView from './FormView';
import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
export const search = 'Search';
export const entities = 'Create Change Request';
export const entity = 'Change Request';
export const edit = 'Edit';
export const title = 'Bizpy.io | Change Request';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function ChangeRequestDetailView() {
  const classes = useStyles();

  // el asset que estoy usando.
  const { currentChangeRequest } = useSelector((state) => state.change_request);
  console.log(`currentChangeRequest ${JSON.stringify(currentChangeRequest)}`)
  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <HeaderDashboard heading={entities} />
        <FormView currentChangeRequest={currentChangeRequest}></FormView>
      </Container>
    </Page>
  );
}

export default ChangeRequestDetailView;
