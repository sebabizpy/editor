import { Grid, TextField, MenuItem, IconButton } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { ISSUE_TYPE, ISSUE_SEVERITY } from '../issue_status_vo';
import { capitalCase } from 'change-case';
import searchIcon from '@iconify-icons/eva/search-fill';
import { Icon } from '@iconify/react';

CreatePart.propTypes = {
  formik: PropTypes.object,
  getFieldProps: PropTypes.func,
  setOpen: PropTypes.func,
  assetError: PropTypes.string,
  asset: PropTypes.object,
  open: PropTypes.bool
};

export function CreatePart({ formik, getFieldProps, assetError, asset, setOpen, open }) {

  return (
    <Grid container spacing={2} >
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
      <Grid item xs={3} sm={1.5} >
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          select
          label={'Type'}
          sx={{ m: 1, pl: 1 }}
          error={(formik.touched.type && formik.errors.type) ? true : false}
          helperText={
            (formik.touched.type && formik.errors.type) ? formik.errors.type : ''
          }
          {...getFieldProps('type')}
        >
          <MenuItem selected id={ISSUE_TYPE.BUG} value={ISSUE_TYPE.BUG}>
            {capitalCase(ISSUE_TYPE.BUG)}
          </MenuItem>
          <MenuItem id={ISSUE_TYPE.OS_UPDATE} value={ISSUE_TYPE.OS_UPDATE}>
            {capitalCase(ISSUE_TYPE.OS_UPDATE)}
          </MenuItem>
          <MenuItem id={ISSUE_TYPE.POLICY} value={ISSUE_TYPE.POLICY}>
            {capitalCase(ISSUE_TYPE.POLICY)}
          </MenuItem>
          <MenuItem id={ISSUE_TYPE.VULNERABILITY} value={ISSUE_TYPE.VULNERABILITY}>
            {capitalCase(ISSUE_TYPE.VULNERABILITY)}
          </MenuItem>

        </TextField>
      </Grid>
      <Grid item xs={3} sm={1.5} >
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          select
          label={'Severity'}
          sx={{ m: 1, pl: 1 }}
          error={(formik.touched.severity && formik.errors.severity) ? true : false}
          helperText={
            (formik.touched.severity && formik.errors.severity) ? formik.errors.severity
             : ''
          }
          {...getFieldProps('severity')}
        >
          <MenuItem selected id={ISSUE_SEVERITY.S1} value={ISSUE_SEVERITY.S1}>
            {capitalCase(ISSUE_SEVERITY.S1)}
          </MenuItem>
          <MenuItem id={ISSUE_SEVERITY.S2} value={ISSUE_SEVERITY.S2}>
            {capitalCase(ISSUE_SEVERITY.S2)}
          </MenuItem>
          <MenuItem id={ISSUE_SEVERITY.S3} value={ISSUE_SEVERITY.S3}>
            {capitalCase(ISSUE_SEVERITY.S3)}
          </MenuItem>
          <MenuItem id={ISSUE_SEVERITY.S4} value={ISSUE_SEVERITY.S4}>
            {capitalCase(ISSUE_SEVERITY.S4)}
          </MenuItem>
          <MenuItem id={ISSUE_SEVERITY.S5} value={ISSUE_SEVERITY.S5}>
            {capitalCase(ISSUE_SEVERITY.S5)}
          </MenuItem>
          <MenuItem id={ISSUE_SEVERITY.S6} value={ISSUE_SEVERITY.S6}>
            {capitalCase(ISSUE_SEVERITY.S6)}
          </MenuItem>

        </TextField>

      </Grid>
      <Grid item xs={6} sm={3} >
        <TextField
          sx={{ m: 1 }}
          size="small"
          fullWidth
          type={'text'}
          error={assetError !== ''}
          helperText={assetError}
          label="Asset"
          value={asset?.name || ''}
          InputProps={{
            tabIndex: '3', endAdornment: <IconButton
              onClick={() => setOpen(true)}
              color={open ? 'primary' : 'default'}
            >
              <Icon icon={searchIcon} width={20} height={20} />
            </IconButton>
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid item xs={12} sm={12}>
          <TextField
            sx={{ m: 1 }}
            size="small"
            fullWidth
            inputProps={{ tabIndex: '3' }}
            type={'text'}
            multiline={true}
            minRows={5}
            maxRows={50}
            label="Description"
            error={(formik.touched.description && formik.errors.description) ? true : false}
            helperText={
              (formik.touched.description && formik.errors.description) ? formik.errors.description : ''
            }
            {...getFieldProps('description')}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
