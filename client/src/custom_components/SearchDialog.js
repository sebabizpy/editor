import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';

SearchDialog.propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    open: PropTypes.bool
};

export function SearchDialog({ onClose, onSelect, open, children }) {

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={'lg'}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Select</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => onClose()}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}




