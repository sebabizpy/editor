import clsx from 'clsx';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { saveIssue, setIssue, updateIssue } from '../../../../redux/slices/issues';
import { useHistory } from 'react-router-dom';

import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { CreatePart } from './CreatePart';
import { ROLE, RoleValidator } from '../../../../custom_components/UserHelper';
import { ISSUE_STATUS } from '../issue_status_vo';

import { PATH_REMEDIATION } from '../../../../routes/paths';
import { SearchDialog } from '../../../../custom_components/SearchDialog';
import AssetSearch from '../../InventoryView/Assets/Main';

const useStyles = makeStyles(() => ({
  root: {}
}));

FormView.propTypes = {
  className: PropTypes.string,
  currentIssue: PropTypes.string,
  readOnly: PropTypes.bool
};

function FormView({ className }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { currentIssue } = useSelector((state) => {
    return state.issue
  });

  const [submitId, setSubmitId] = useState('');

  const [assetRow, setAssetRow] = useState(
    currentIssue?.asset ? currentIssue?.asset : {}
  );
  const [assetError, setAssetError] = useState('');
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      title: currentIssue?.title ? currentIssue?.title : '',
      description: currentIssue?.description ? currentIssue?.description : '',
      type: currentIssue?.type ? currentIssue?.type : '',
      severity: currentIssue?.severity ? currentIssue?.severity : ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Enter the title').max(250),
      description: Yup.string().required('Enter the description'),
      severity: Yup.string().required('Select the severity'),
      type: Yup.string().required('Select the type')
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      function callOnSubmitted(status) {
        console.log(' status' + status);
        console.log(' isMountedRef.current' + isMountedRef.current);
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        if (status) {
          history.push(PATH_REMEDIATION.remediation.issues);
          resetForm({});
          enqueueSnackbar(`Issue ${currentIssue ? 'Updated' : 'Created'}`, {
            variant: 'success'
          });
        } else {
          enqueueSnackbar('Error creating issue', { variant: 'error' });
        }
      }

      try {
        setSubmitting(true);
        if (assetRow?.id == undefined) {
          console.log('row assetRow' + assetRow?.id);
          setAssetError('Select the asset');
          setErrors({
            asset: assetError
          });
          return;
        }

        const vals = {
          title: values.title,
          description: values.description,
          type: values.type,
          severity: values.severity,
          requested_by: user.first_name,
          asset: { id: assetRow.id },
          status: submitId
        };

        if (currentIssue?.id) {
          vals['id'] = currentIssue.id
        }

        console.log(`submitId ${submitId}`)
        if (!submitId) {
          dispatch(saveIssue(vals, callOnSubmitted));
        } else {
          dispatch(updateIssue(vals, callOnSubmitted));
        }

      } catch (error) {
        callOnSubmitted();
      }
    }
  });

  const onSelectedRow = (row) => {
    setAssetError('');
    setAssetRow(row);
    setOpen(false);
  };

  const onClose = (evt) => {
    setOpen(false);
  };

  const { isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <div className={clsx(classes.root, className)}>
      <SearchDialog open={open} onClose={onClose}>
        <AssetSearch key={1} editing={false} onSelectRow={onSelectedRow} />
      </SearchDialog>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid item xs={12} md={12}>
                <Grid item xs={12} md={12}>
                  <CreatePart
                    formik={formik}
                    getFieldProps={getFieldProps}
                    assetError={assetError}
                    setOpen={setOpen}
                    asset={assetRow}
                    open={open}
                  ></CreatePart>
                </Grid>
              </Grid>
              <Grid container justifyContent='right' alignContent='end'>

                {currentIssue?.status === ISSUE_STATUS.OPEN && (
                  <RoleValidator user={user} minRole={ROLE.engineer}>
                    <Grid xs={1} sm={1} >
                      <LoadingButton
                        type="submit"
                        onClick={() =>
                          setSubmitId(ISSUE_STATUS.WIP)
                        }
                        variant="contained"
                        pending={isSubmitting}
                      >
                        {'Take Ownership'}
                      </LoadingButton>
                    </Grid>
                  </RoleValidator>
                )}

                {currentIssue?.status === ISSUE_STATUS.WIP && (

                  <RoleValidator user={user} minRole={ROLE.approver}>
                    
                    <Grid item  >
                      <LoadingButton

                        onClick={() =>
                          setSubmitId(ISSUE_STATUS.RESOLVED)
                        }
                        type="submit"
                        variant="contained"
                        pending={isSubmitting}
                      >
                        {'Resolve'}
                      </LoadingButton>
                    </Grid>
                    <Grid item ml={2} >
                      <LoadingButton ml={'auto'}
                        onClick={() =>
                          setSubmitId(ISSUE_STATUS.CLOSED)
                        }
                        type="submit"
                        variant="contained"
                        pending={isSubmitting}
                      >
                        {'Close'}
                      </LoadingButton>
                    </Grid>
                  </RoleValidator>
                )}
                {!currentIssue && (
                  <RoleValidator user={user} minRole={ROLE.engineer}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      onClick={() => {
                        dispatch(setIssue(undefined));
                      }}
                      pending={isSubmitting}
                    >
                      {'Create'}
                    </LoadingButton>
                  </RoleValidator>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default FormView;
