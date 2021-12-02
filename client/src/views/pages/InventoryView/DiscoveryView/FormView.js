import clsx from 'clsx';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Coverage from './Coverage';
import Vendor from './Vendor';
import ShowAssetMain from './ShowAssetMain';
import Alerts from './Alerts';
import LoadingProgress from '../../../../custom_components/LoadingProgress';
import { useGetDiscoveryStatusQuery } from '../../../../redux/rtk/automationApi';
import { setPi } from '../../../../redux/slices/assets';
import { useHistory } from 'react-router';
import { PATH_ASSETS } from '../../../../routes/paths';
import Header from './Header';
import TaskView from '../../TaskView/Main/Main';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

FormView.propTypes = {
  asset: PropTypes.object
};

function FormView({ asset }) {
  const dispatch = useDispatch();

  const { pi } = useSelector((state) => state.asset);

  useEffect(() => {
    dispatch(setPi(3000));
  }, [dispatch]);

  // TODO: Atajar los errores
  const { data, error, isLoading, isFetching } = useGetDiscoveryStatusQuery(
    asset.id,
    {
      pollingInterval: pi
    }
  );

  const done = data?.asset.status === "DISCOVERED";
  const currentAsset = data?.asset;

  if (done) {
    console.log('done asset ' + currentAsset.id);
    dispatch(setPi(0));
  }

  return (
    <div>
      {done && (
        <>
          <Header assetId={asset.id} runId={asset.run_id} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box flexDirection="column">
                <Box sx={{ mt: 3 }}>
                  <Alerts data={data} />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <ShowAssetMain currentAsset={currentAsset} />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Vendor currentAsset={currentAsset} />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Coverage currentAsset={currentAsset} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      {(
        <LoadingProgress asset={asset} upper={'Getting detail info...'} scale={0.5} />
      )}

    </div>
  );
}

export default FormView;
