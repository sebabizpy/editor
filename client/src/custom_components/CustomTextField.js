import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

CustomTextField.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string
};

export default function CustomTextField({ label, value, readOnly = false }) {
  return (
    <TextField
      sx={{ m: 1 }}
      size="small"
      fullWidth
      inputProps={{ readOnly: readOnly }}
      label={label}
      value={value}
    />
  );
}
