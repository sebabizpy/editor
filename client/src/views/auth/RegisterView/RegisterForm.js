import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Form, FormikProvider } from 'formik';
import eyeFill from '@iconify-icons/eva/eye-fill';
import eyeOffFill from '@iconify-icons/eva/eye-off-fill';
import { passwordError, emailError } from '../../../utils/helpError';
import { Box, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

RegisterForm.propTypes = {
  formik: PropTypes.object.isRequired
};

function RegisterForm({ formik }) {
  const [showPassword, setShowPassword] = useState(false);
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="email"
          label="Email"
          {...getFieldProps('email')}
          error={
            Boolean(touched.email && errors.email) ||
            emailError(errors.afterSubmit).error
          }
          helperText={
            (touched.email && errors.email) ||
            emailError(errors.afterSubmit).helperText
          }
        />
        <Box sx={{ mb: 3 }} />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...getFieldProps('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={handleShowPassword} edge="end">
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            )
          }}
          error={
            Boolean(touched.password && errors.password) ||
            passwordError(errors.afterSubmit).error
          }
          helperText={
            (touched.password && errors.password) ||
            passwordError(errors.afterSubmit).helperText
          }
        />
        <Box sx={{ mb: 3 }} />
        <TextField
          fullWidth
          type="string"
          label="First name"
          {...getFieldProps('firstName')}
          // Add handling for errors here
          error={Boolean(touched.firstName && errors.firstName)}
          helperText={touched.firstName && errors.firstName}
        />
        <Box sx={{ mb: 3 }} />
        <TextField
          fullWidth
          type="string"
          label="Last name"
          {...getFieldProps('lastName')}
          // Add handling for errors here
          error={Boolean(touched.lastName && errors.lastName)}
          helperText={touched.lastName && errors.lastName}
        />
        <Box sx={{ mb: 3 }} />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          pending={isSubmitting}
        >
          Register
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

export default RegisterForm;
