import LoadingScreen from '../../../components/LoadingScreen';
import { useGetDiscoveryStatusQuery } from '../../../redux/rtk/automationApi';
import React, { useState } from 'react';
import { LoadingButton } from '@material-ui/lab';

function ReporteProductoView() {
  const [pi, setPi] = useState(500);
  const { data, error, isLoading, isFetching } = useGetDiscoveryStatusQuery(
    11,
    {
      pollingInterval: pi
    }
  );
  console.log('data ' + JSON.stringify(data));
  console.log('error ' + JSON.stringify(error));
  console.log('isLoading ' + isLoading);
  console.log('isFetching ' + isFetching);
  return (
    <>
      <h1>HOLA</h1>
      <h1>isFetching {isFetching}</h1>
      <LoadingButton
        type="submit"
        variant="contained"
        onClick={() => {
          setPi(0);
        }}
      >
        {'Cancelar'}
      </LoadingButton>
      <LoadingButton
        type="submit"
        variant="contained"
        onClick={() => {
          setPi(500);
        }}
      >
        {'Dale'}
      </LoadingButton>
      <LoadingScreen />
    </>
  );
}

export default ReporteProductoView;
