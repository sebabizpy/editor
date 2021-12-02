import { HeaderDashboard } from '../../../../layouts/Common';
import React from 'react';
import Main from './Main';
import { Container } from '@material-ui/core';
import Page from '../../../../components/Page';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';

const entities = 'Non Compliant Issues';
export const title = 'Bizpy.io | Non Compliant Issues';

const useStyles = makeStyles((theme) => ({
    root: {},
    tabBar: {
        marginBottom: theme.spacing(1)
    }
}));

export default function MainView() {
    const classes = useStyles();
    const { run_id } = useParams()
    console.log("RUN_ID " + run_id)


    return (
        <Page title={title} className={classes.root}>
            <Container maxWidth={false}>
                <HeaderDashboard heading={entities} />
                <Main run_id={run_id}></Main>
            </Container>
        </Page>
    );
}