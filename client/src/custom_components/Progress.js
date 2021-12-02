import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import LinearProgress, {
  linearProgressClasses
} from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));

Progress.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  variant: PropTypes.string
};

export default function Progress({
  value,
  upper,
  lower = 'This could take a few minutes.',
  variant
}) {
  return (
    <Card>
      <CardContent>
        <Grid container xs={12} md={12} justifyContent="center">
          <Typography alignItems={'center'} variant="h8" paragraph={true}>
            {upper}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <BorderLinearProgress variant={variant} value={value} />
        </Grid>
        <Grid container xs={12} md={12} justifyContent="center">
          <Typography alignItems={'center'} variant="h8" paragraph={true}>
            {lower}
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  );
}
