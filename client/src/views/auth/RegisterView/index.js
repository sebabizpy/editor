import React from 'react';
import * as Yup from 'yup';
// Check this later. Maybe we need another image.
import Section from '../LoginView/Section';
import { useFormik } from 'formik';
import RegisterForm from './RegisterForm';
import { Icon } from '@iconify/react';
import Page from '../../../components/Page';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify-icons/eva/close-fill';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Alert, Hidden, Container, Typography } from '@material-ui/core';
import { MIconButton } from '../../../theme';
import { reset } from '../../../redux/slices/authJwt';
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  header: {
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-start',
      padding: theme.spacing(7, 5, 0, 7)
    }
  },
  content: {
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
  }
}));

// ----------------------------------------------------------------------

function RegisterView() {
  const classes = useStyles();
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { error } = useSelector((state) => state.authJwt);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email('Ingrese un Email valido')
      .required('Ingrese un Email'),
    password: Yup.string().required('Ingrese el Password'),
    firstName: Yup.string().required('Ingrese el First name'),
    lastName: Yup.string().required('Ingrese el Last name')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        dispatch(reset);
        await register({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (er) {
        enqueueSnackbar('Problemas con el servidor !!!', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.code || error.message });
        }
      }
    }
  });

  return (
    <Page title="Register | Bizpy.io" className={classes.root}>
      <Hidden mdDown>
        <Section />
      </Hidden>

      <Container maxWidth="sm">
        <div className={classes.content}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sistema de gestion Bizpy.io
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Ingrese sus credenciales
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity={'error'} sx={{ mb: 5 }}>
              {error.message}
            </Alert>
          )}

          <RegisterForm formik={formik} />
        </div>
      </Container>
    </Page>
  );
}

export default RegisterView;
