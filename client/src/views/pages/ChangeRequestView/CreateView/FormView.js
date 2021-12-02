import clsx from 'clsx';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Grid, TextField, MenuItem, IconButton } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import {
  saveChangeRequest, setChangeRequest, updateChangeRequest
} from '../../../../redux/slices/change_request';
import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { ROLE, RoleValidator } from '../../../../custom_components/UserHelper';
import { CR_STATUS } from '../change_request_status_vo';
import IssueSearch from '../../IssueView/Main/Main';
import { SearchDialog } from '../../../../custom_components/SearchDialog';
import searchIcon from '@iconify-icons/eva/search-fill';
import { Icon } from '@iconify/react';
import DateTimeRange from '../../../../custom_components/DateTimeRange'
import { useHistory } from 'react-router';
import { PATH_REMEDIATION } from '../../../../routes/paths';

const useStyles = makeStyles(() => ({
  root: {}
}));

FormView.propTypes = {
  className: PropTypes.string,
  currentChangeRequest: PropTypes.object,
  readOnly: PropTypes.bool
};

function FormView({ className, currentChangeRequest }) {

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [submitId, setSubmitId] = useState();
  const [open, setOpen] = useState();
  const [issue, setIssue] = useState(currentChangeRequest?.issue);
  const [issueError, setIssueError] = useState('');

  const [hasOutrage, setHasOutrage] = useState(currentChangeRequest?.hasOutrage);
  const [scheduledDate, setScheduledDate] = useState(currentChangeRequest?.scheduledDate);
  const [endScheduledDate, setEndScheduledDate] = useState(currentChangeRequest?.endScheduledDate);
  const [initOutrageDate, setInitOutrageDate] = useState(currentChangeRequest?.initOutrageDate);
  const [endOutrageDate, setEndOutrageDate] = useState(currentChangeRequest?.endOutrageDate);



  const { user } = useAuth();

  const onSelectedRow = (row) => {
    setIssueError('');
    setIssue(row);
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      title: currentChangeRequest?.title ? currentChangeRequest?.title : '',
      description: currentChangeRequest?.description
        ? currentChangeRequest?.description
        : '',
      severity: currentChangeRequest?.severity ? currentChangeRequest?.severity : ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Enter the title').max(100),
      description: Yup.string().required('Enter the description'),
      severity: Yup.string().required('Set the severity'),

    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      function callOnSubmitted(ok) {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        if (ok) {
          resetForm({});
          enqueueSnackbar('ChangeRequest Created', { variant: 'success' });
          history.push(PATH_REMEDIATION.remediation.change_requests);
        }
      }

      try {

        console.log(`#### issue ${issue}`)
        if (!issue) {
          setIssueError(' Set the issue');
          return
        }

        setSubmitting(true);

        const vals = {
          title: values.title,
          description: values.description,
          issue: issue,
          status: submitId,
          hasOutrage: hasOutrage,
          scheduledDate: scheduledDate,
          endScheduledDate: endScheduledDate,
          initOutrageDate: initOutrageDate,
          endOutrageDate: endOutrageDate,

        };

        if (currentChangeRequest?.id) {
          vals['id'] = currentChangeRequest.id
        }

        console.log(`submitId ${submitId}`)
        if (!submitId) {
          dispatch(saveChangeRequest(vals, callOnSubmitted));
        } else {
          dispatch(updateChangeRequest(vals, callOnSubmitted));
        }

      } catch (error) {
        callOnSubmitted();
      }
    }
  });

  let issueName = ''
  if (currentChangeRequest?.issue?.title && currentChangeRequest?.issue?.severity) {
    issueName = `[${currentChangeRequest?.issue?.severity}] ${currentChangeRequest?.issue?.title}`
  }

  const og_id = currentChangeRequest?.issue?.asset?.ownersGroup?.id
  const sg_id = currentChangeRequest?.issue?.asset?.supportGroup?.id

  console.log(`## og_id ${og_id}`)
  console.log(`## sg_id ${sg_id}`)
  console.log(`## user_group_id ${user?.group?.id}`)
  console.log(`## user_role ${user?.role}`)
  console.log(`## status ${currentChangeRequest?.status}`)
  console.log(`## currentChangeRequest?.status === CR_STATUS.PENDING_APPROVAL && user?.group?.id === og_id ${currentChangeRequest?.status === CR_STATUS.PENDING_APPROVAL && user?.group?.id === og_id}`)

  const { isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <div className={clsx(classes.root, className)}>
      <SearchDialog open={open} onClose={onClose}>
        <IssueSearch key={1} editing={false} onSelectRow={onSelectedRow} />
      </SearchDialog>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Grid item xs={12} md={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          sx={{ m: 1 }}
                          size="small"
                          error={formik.touched.title && formik.errors.title ? true : false}
                          helperText={
                            formik.touched.title && formik.errors.title
                              ? formik.errors.title
                              : ''
                          }
                          id={'title'}
                          fullWidth
                          label="Title"
                          inputProps={{ tabIndex: '1' }}
                          {...getFieldProps('title')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          sx={{ m: 1 }}
                          size="small"
                          fullWidth
                          type={'text'}
                          error={issueError !== ''}
                          helperText={issueError}
                          label="Issue"
                          value={issueName}
                          InputProps={{
                            tabIndex: '3',
                            endAdornment: (
                              <IconButton
                                onClick={() => setOpen(true)}
                                color={open ? 'primary' : 'default'}
                              >
                                <Icon icon={searchIcon} width={20} height={20} />
                              </IconButton>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          sx={{ m: 1 }}
                          disabled
                          size="small"
                          label={'Owner Group'}
                          value={issue?.asset?.ownersGroup?.name || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          sx={{ m: 1 }}
                          variant="outlined"
                          fullWidth
                          disabled
                          size="small"
                          label={'Support Group'}
                          value={issue?.asset?.supportGroup?.name || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          sx={{ m: 1 }}
                          size="small"
                          fullWidth
                          inputProps={{ tabIndex: '3' }}
                          type={'text'}
                          multiline={true}
                          minRows={7}
                          maxRows={50}
                          label="Description"
                          error={
                            formik.touched.description && formik.errors.description
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.description && formik.errors.description
                              ? formik.errors.description
                              : ''
                          }
                          {...getFieldProps('description')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <DateTimeRange label="Scheduled Range" setInit={setScheduledDate} init={scheduledDate} setEnd={setEndScheduledDate} end={endScheduledDate} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <DateTimeRange useCb={true} label="Scheduled Range" setChecked={setHasOutrage} isChecked={hasOutrage}
                          setInit={setInitOutrageDate} init={initOutrageDate} setEnd={setEndOutrageDate} end={endOutrageDate} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <RoleValidator user={user} minRole={ROLE.engineer}>
                  <Grid container justifyContent='right' alignContent='end'>

                    {currentChangeRequest?.status === CR_STATUS.NEW && user?.group?.id === sg_id && (
                      <RoleValidator user={user} minRole={ROLE.engineer}>
                        <Grid xs={1} sm={1} >
                          <LoadingButton
                            type="submit"
                            onClick={() =>
                              setSubmitId(CR_STATUS.PENDING_APPROVAL)
                            }
                            variant="contained"
                            pending={isSubmitting}
                          >
                            {'Take Ownership'}
                          </LoadingButton>
                        </Grid>
                      </RoleValidator>
                    )}

                    {currentChangeRequest?.status === CR_STATUS.PENDING_APPROVAL && user?.group?.id === og_id && (

                      <RoleValidator user={user} minRole={ROLE.approver}>

                        <Grid item  >
                          <LoadingButton

                            onClick={() =>
                              setSubmitId(CR_STATUS.IN_PROGRESS)
                            }
                            type="submit"
                            variant="contained"
                            pending={isSubmitting}
                          >
                            {'Approve'}
                          </LoadingButton>
                        </Grid>
                        <Grid item ml={2} >
                          <LoadingButton ml={'auto'}
                            onClick={() =>
                              setSubmitId(CR_STATUS.NEW)
                            }
                            type="submit"
                            variant="contained"
                            pending={isSubmitting}
                          >
                            {'Rejected'}
                          </LoadingButton>
                        </Grid>
                      </RoleValidator>
                    )}

                    {currentChangeRequest?.status === CR_STATUS.IN_PROGRESS && user?.group?.id === sg_id && (

                      <RoleValidator user={user} minRole={ROLE.engineer}>

                        <Grid item  >
                          <LoadingButton

                            onClick={() =>
                              setSubmitId(CR_STATUS.RESOLVED)
                            }
                            type="submit"
                            variant="contained"
                            pending={isSubmitting}
                          >
                            {'Done'}
                          </LoadingButton>
                        </Grid>
                        {/*   <Grid item ml={2} >
                          <LoadingButton ml={'auto'}
                            onClick={() =>
                              setSubmitId(CR_STATUS.CANCELED)
                            }
                            type="submit"
                            variant="contained"
                            pending={isSubmitting}
                          >
                            {'Cancel'}
                          </LoadingButton>
                        </Grid> */}
                      </RoleValidator>
                    )}
                    {!currentChangeRequest && (
                      <RoleValidator user={user} minRole={ROLE.engineer}>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          onClick={() => {
                            dispatch(setChangeRequest(undefined));
                          }}
                          pending={isSubmitting}
                        >
                          {'Create'}
                        </LoadingButton>
                      </RoleValidator>
                    )}
                  </Grid>
                </RoleValidator>
              </Grid>
            </CardContent>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default FormView;
