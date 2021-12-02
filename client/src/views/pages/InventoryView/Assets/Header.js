import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import { Icon } from '@iconify/react';
import searchIcon from '@iconify-icons/eva/search-fill';
import { useHistory } from 'react-router-dom';
import { PATH_ASSETS } from '../../../../routes/paths';

Header.propTypes = {
  total: PropTypes.number.isRequired
};

export default function Header() {
  const history = useHistory();

  function onCreateAssetsClick() {
    history.push(PATH_ASSETS.general.create);
  }

  function onDiscoverAssetsClick() {
    history.push(PATH_ASSETS.general.discovery.replace(":id",1));
  }

  function onBulkUploadAssetsClick() {
    history.push(PATH_ASSETS.general.bulk_upload);
  }


  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Discovery'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'Allows you to discover all assets in a subnet'}
              </Typography>
              <LoadingButton
                type="submit"
                variant="contained"
                onClick={onDiscoverAssetsClick}
              >
                {'Find assets'}
                <Icon disabled width={20} height={20} icon={searchIcon} />
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Add new asset'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'Add a new asset to inventory using the IP'}
              </Typography>
              <LoadingButton
                style={{ margin: 3 }}
                type="submit"
                variant="contained"
                onClick={onCreateAssetsClick}
              >
                {'Add asset'}
              </LoadingButton>
              <LoadingButton
                style={{ margin: 3 }}
                type="submit"
                variant="contained"
                onClick={onBulkUploadAssetsClick}
              >
                {'Upload assets list'}
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
