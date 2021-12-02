import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

ErrorProvider.propTypes = {
  children: PropTypes.node
};

function ErrorProvider({ children }) {
  const { dialog, openDialog } = useSelector((state) => state.errorDialog);

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={dialog.onCloseFn}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {dialog.cancelBtnClickFn && (
            <Button variant="contained" onClick={dialog.cancelBtnClickFn}>
              {dialog.cancelBtnMsg}
            </Button>
          )}
          {dialog.acceptBtnClickFn && (
            <Button color="inherit" onClick={dialog.acceptBtnClickFn}>
              {dialog.acceptBtnMsg}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {children}
    </>
  );
}

export default ErrorProvider;
