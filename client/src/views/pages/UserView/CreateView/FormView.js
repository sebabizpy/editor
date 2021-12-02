import clsx from 'clsx';
import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Card,
  TextField,
  CardContent,
  MenuItem
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUser,
  setUserToEdit,
  updateUser,
  onChangeStatus
} from '../../../../redux/slices/user';
import { PATH_GENERAL } from '../../../../routes/paths';
import { useHistory } from 'react-router';
import { ROLE } from '../../../../custom_components/UserHelper';
import { getGroupsList } from '../../../../redux/slices/group';
// ----------------------------------------------------------------------

const useStyles = makeStyles(() => ({
  root: {}
}));

FormView.propTypes = {
  className: PropTypes.string
};

function FormView({ className }) {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { changed, editingUser } = useSelector((state) => state.user);
  // const { user, updateProfile } = useAuth();

  const { groupList } = useSelector((state) => state.group)

  React.useEffect(() => {
    dispatch(getGroupsList());
  }, [dispatch]);



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: editingUser ? editingUser.firstName : '',
      lastName: editingUser ? editingUser.lastName : '',
      email: editingUser ? editingUser.email : '',
      phone: editingUser ? editingUser.phone : '',
      celPhone: editingUser ? editingUser.celPhone : '',
      address: editingUser ? editingUser.address : '',
      cp: editingUser ? editingUser.cp : '',
      city: editingUser ? editingUser.city : '',
      province: editingUser ? editingUser.province : '',
      role: editingUser ? editingUser.role : '',
      password: editingUser ? editingUser.password : '',
      p2: '',
      userGroup: editingUser ? editingUser.group.id : ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Enter the first name'),
      lastName: Yup.string().required('Enter the last name'),
      email: Yup.string()
        .email('the email is not valid')
        .required('Enter the email'),
      phone: Yup.string().required('Enter the phone'),
      address: Yup.string().required('Enter the address'),
      cp: Yup.string().required('Enter the postal code'),
      city: Yup.string().required('Enter the city'),
      province: Yup.string().required('Enter the state'),
      role: Yup.string().required('Select the role'),
      userGroup: Yup.number().required(`Select the user's group`),
    }),
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log('onSubmit');
      try {
        setSubmitting(true);
        if (editingUser) {

          if (!values.password) {
            setErrors({
              password: 'Enter the password'
            });
          }

          if (!values.p2) {
            setErrors({
              password: 'Enter the password'
            });
          }
          if (values.password !== values.p2) {
            setErrors({
              password: 'Enter the same password',
              p2: 'Enter the same password'
            });
          }


        }

        if (values.userGroup) {
          values['group'] = { id: values.userGroup }
        }

        if (editingUser) {
          console.log('dispatching updateUser');
          dispatch(updateUser({ ...editingUser, ...values }));
          dispatch(setUserToEdit(null));
        } else {
          console.log('dispatching createUser');
          dispatch(createUser(values));
        }
        // TODO: revisar aca falla el back y cagaste.
        resetForm({});
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
    }
  });
  if (changed !== 'none') {
    enqueueSnackbar(`User ${changed}`, { variant: 'success' });
    dispatch(onChangeStatus('none'));
  }

  function cancelUpdate() {
    dispatch(setUserToEdit(undefined));

    history.push(PATH_GENERAL.entities.users);
  }

  const { isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          aria-autocomplete={'none'}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        error={
                          formik.touched.firstName && formik.errors.firstName
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.firstName ? formik.errors.firstName : ''
                        }
                        id={'firstName'}
                        fullWidth
                        label="First Name"
                        {...getFieldProps('firstName')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        error={
                          formik.touched.lastName && formik.errors.lastName
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.lastName ? formik.errors.lastName : ''
                        }
                        fullWidth
                        label="Last Name"
                        {...getFieldProps('lastName')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        error={
                          formik.touched.email && formik.errors.email
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.email ? formik.errors.email : ''
                        }
                        label="Email"
                        {...getFieldProps('email')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        error={
                          formik.touched.phone && formik.errors.phone
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.phone ? formik.errors.phone : ''
                        }
                        fullWidth
                        label="Phone"
                        {...getFieldProps('phone')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        type={'password'}
                        password
                        error={
                          formik.touched.password && formik.errors.password
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.password ? formik.errors.password : ''
                        }
                        fullWidth
                        label="Password"
                        {...getFieldProps('password')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        type={'password'}
                        password
                        error={
                          formik.touched.p2 && formik.errors.p2 ? true : false
                        }
                        helperText={formik.errors.p2 ? formik.errors.p2 : ''}
                        fullWidth
                        label="Repeat Password"
                        {...getFieldProps('p2')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        error={
                          formik.touched.celPhone && formik.errors.celPhone
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.celPhone ? formik.errors.celPhone : ''
                        }
                        label="Cel Phone"
                        {...getFieldProps('celPhone')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        error={
                          formik.touched.address && formik.errors.address
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.address ? formik.errors.address : ''
                        }
                        fullWidth
                        label="Address"
                        {...getFieldProps('address')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        error={
                          formik.touched.province && formik.errors.province
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.province ? formik.errors.province : ''
                        }
                        label="State"
                        {...getFieldProps('province')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        error={
                          formik.touched.city && formik.errors.city
                            ? true
                            : false
                        }
                        helperText={
                          formik.errors.city ? formik.errors.city : ''
                        }
                        label="City"
                        {...getFieldProps('city')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        error={
                          formik.touched.cp && formik.errors.cp ? true : false
                        }
                        helperText={formik.errors.cp ? formik.errors.cp : ''}
                        label="Postal code"
                        {...getFieldProps('cp')}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        select
                        size="small"
                        error={formik.errors.role ? true : false}
                        helperText={
                          formik.errors.role ? formik.errors.role : ''
                        }
                        label={'Role'}
                        {...getFieldProps('role')}
                      >
                        <MenuItem value={ROLE.user.name}>User</MenuItem>
                        <MenuItem value={ROLE.engineer.name}>Engineer</MenuItem>
                        <MenuItem value={ROLE.approver.name}>Approver</MenuItem>
                        <MenuItem value={ROLE.admin.name}>Admin</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        select
                        label={'Group'}
                        error={(formik.touched.userGroup && formik.errors.userGroup) ? true : false}
                        helperText={
                          (formik.touched.userGroup && formik.errors.userGroup) ? formik.errors.userGroup : ''
                        }
                        {...getFieldProps('userGroup')}
                      >
                        {groupList.map(function (group, idx) {
                          return (
                            <MenuItem id={idx} value={group.id}>
                              {group.name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      pending={isSubmitting}
                    >
                      {editingUser ? 'Save' : 'Create'}
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default FormView;
