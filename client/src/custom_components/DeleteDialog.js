import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import React from 'react';

DeleteDialog.propTypes = {
  openDialog: PropTypes.bool,
  closeDeleteDialog: PropTypes.func,
  deleteRow: PropTypes.func
};

export function DeleteDialog({ openDialog, closeDeleteDialog, deleteRow }) {
  return (
    <Dialog
      open={openDialog}
      onClose={closeDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Attention</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you really want to delete this row &#x3F;
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeDeleteDialog}>
          Cancel
        </Button>
        <Button color="inherit" onClick={deleteRow}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
