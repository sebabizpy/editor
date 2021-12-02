import FormView from './FormView';
import Page from '../../../../components/Page';
import React from 'react';
import { HeaderDashboard } from '../../../../layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getAssetById } from '../../../../redux/slices/assets';
import LoadingScreen from '../../../../components/LoadingScreen';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';

export const search = 'Search';
export const entities = 'New Asset';
export const entity = 'Asset';
export const edit = 'Edit';
export const title = 'Asset | Bizpy.io';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(1)
  }
}));

function AssetDetailView() {
  const classes = useStyles();
  const { id } = useParams()
  const dispatch = useDispatch()
  const isMountedRef = useIsMountedRef();


  React.useEffect(() => {
    dispatch(getAssetById(id))
  }, [dispatch, id]);
  // el asset que estoy usando.
  const { currentAsset } = useSelector((state) => state.asset);

  if (!isMountedRef) {
    return null
  }

  console.log("asset id" + currentAsset.id);

  return (
    <Page title={title} className={classes.root}>
      <Container maxWidth={false}>
        <>
          <HeaderDashboard heading={currentAsset?.name} />
          <FormView asset={currentAsset} ></FormView>
        </>
      </Container>
    </Page>
  );
}

export default AssetDetailView;
