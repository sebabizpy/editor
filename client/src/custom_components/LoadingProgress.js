import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import { makeStyles, alpha } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useHistory } from 'react-router';
import { PATH_ASSETS } from '../routes/paths';


// ----------------------------------------------------------------------

const TRANSITION = {
  ease: 'linear',
  duration: 3.2,
  loop: Infinity
};

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
  className: PropTypes.string,
  scale: PropTypes.number
};

export const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default
  },
  box: {
    position: 'absolute',
    borderRadius: '25%'
  },
  inner: (props) => ({
    width: 100 * props.scale,
    height: 100 * props.scale,
    border: `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`
  }),
  outside: (props) => ({
    width: 120 * props.scale,
    height: 120 * props.scale,
    border: `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`
  })
}));

function LoadingScreen({ className, scale = 1 }) {
  const styleProps = { scale: scale };
  const classes = useStyles(styleProps);

  return (
    <div className={clsx(classes.root, className)}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          flip: Infinity,
          repeatDelay: 1
        }}
      >
        <Logo sx={{ height: 64 * scale }} />
      </motion.div>

      <motion.div
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={TRANSITION}
        className={clsx(classes.box, classes.inner)}
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          loop: Infinity
        }}
        className={clsx(classes.box, classes.outside)}
      />
    </div>
  );
}

LoadingProgress.propTypes = {
  asset: PropTypes.object,
  value: PropTypes.number,
  label: PropTypes.string,
  variant: PropTypes.string,
  zoom: PropTypes.number
};

export default function LoadingProgress({
  asset,
  value,
  upper,
  lower = 'This could take a few minutes.',
  scale = 1
}) {

  const history = useHistory()

  const onClickCheckDetail = (evt) => {
    history.push(PATH_ASSETS.general.run.replace(":id", asset.id).replace(":run_id", asset.run_id))
  }


  return (
    <Card>
      <CardContent>
        <Grid container xs={12} md={12} justifyContent="center">
          <Typography alignItems={'center'} variant="h8" paragraph={true}>
            {upper}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} padding={5}>
          <LoadingScreen scale={scale} />
        </Grid>
        <Grid container xs={12} md={12} justifyContent="center">
          <Typography alignItems={'center'} variant="h8" paragraph={true}>
            {lower}
          </Typography>
        </Grid>
        <Grid container xs={12} md={12} justifyContent="center">
          <Button onClick={onClickCheckDetail}>
            Check Detail
          </Button>
        </Grid>

      </CardContent>
    </Card>
  );
}
