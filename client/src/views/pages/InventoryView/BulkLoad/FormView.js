import clsx from 'clsx';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import UploadSingleFile from '../../../../components/Upload/UploadSingleFile'
import { useHistory } from 'react-router';
import { PATH_ASSETS } from '../../../../routes/paths';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

FormView.propTypes = {
  className: PropTypes.string,
  currentAsset: PropTypes.string
};

function FormView({ className }) {
  const classes = useStyles();
  const history = useHistory();

  const [file, setFile] = useState();

  function handleDropSingleFile() {
    console.log("cayo algo")
  }

  function back() {
    history.push(PATH_ASSETS.general.search);
  }

  return (
    <div className={clsx(classes.root, className)}>
      <UploadSingleFile file={file} onDrop={handleDropSingleFile} />
      <Box sx={{ m: 2, p: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton onClick={back} variant="contained">
          {'Back'}
        </LoadingButton>
      </Box>
    </div>
  );
}

export default FormView;
