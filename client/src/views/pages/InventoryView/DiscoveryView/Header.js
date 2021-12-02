import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import { Icon } from '@iconify/react';
import searchIcon from '@iconify-icons/eva/search-fill';
import { useHistory } from 'react-router-dom';
import { PATH_ASSETS } from '../../../../routes/paths';

Header.propTypes = {
  assetId: PropTypes.number.isRequired,
};

export default function Header({assetId}) {
  const history = useHistory();

  function onCheckComponentsClick() {
    history.push(PATH_ASSETS.general.component.replace(":id", assetId));
  }

  function onCheckConfigClick() {
    history.push(PATH_ASSETS.general.configs.replace(":id", assetId));
  }

  return (
    <>
      <Grid container spacing={3} paddingBottom={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Configuration'}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {"Access to configuration's history"}
              </Typography>
              <LoadingButton
                type="submit"
                variant="contained"
                onClick={onCheckConfigClick}
              >
                {'Check configurations '}
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" paragraph={true} sx={{ mx: 1 }}>
                {'Components '}
              </Typography>
              <Typography variant="h6" paragraph={true} sx={{ mx: 1 }}>
                {'Access to Hardware detail'}
              </Typography>
              <LoadingButton
                type="submit"
                variant="contained"
                onClick={onCheckComponentsClick
            }
              >
                {'Check Components'}
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
