import React from 'react';
import * as Yup from 'yup';
import Section from './Section';
import { useFormik } from 'formik';
import LoginForm from './LoginForm';
import { Icon } from '@iconify/react';
import Page from '../../../components/Page';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify-icons/eva/close-fill';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { makeStyles } from '@material-ui/core/styles';
import { PATH_PAGE } from '../../../routes/paths';
import {
  Box,
  Link,
  Alert,
  Hidden,
  Container,
  Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { MIconButton } from '../../../theme';
import { reset } from '../../../redux/slices/authJwt';
import { useDispatch, useSelector } from 'react-redux';

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

function LoginView() {
  const classes = useStyles();
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { error } = useSelector((state) => state.authJwt);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email ')
      .required('Enter your email'),
    password: Yup.string().required('Enter your password')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        dispatch(reset);
        await login({
          email: values.email,
          password: values.password
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
    <Page title="Bizpy.io | Login" className={classes.root}>
      <Hidden mdDown>
        <Section />
      </Hidden>

      <Container maxWidth="sm">
        <div className={classes.content}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>

            <Box sx={{ flexGrow: 1 }}>
              <Box
                component="img"
                alt="logo"
                src="/static/brand/logo_single.svg"
                height={40}
              />
              <Typography sx={{ color: 'text.secondary' }}>Log in</Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity={'error'} sx={{ mb: 5 }}>
              {error.message}
            </Alert>
          )}

          <LoginForm formik={formik} />

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don’t have an account?&nbsp;
            <Link
              variant="subtitle2"
              component={RouterLink}
              to={PATH_PAGE.auth.register}
            >
              Get started
            </Link>
          </Typography>
        </div>
      </Container>
    </Page>
  );
}

export default LoginView;
