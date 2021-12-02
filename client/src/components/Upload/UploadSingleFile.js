import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect } from 'react';
import { makeStyles , useTheme } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/eva/cloud-upload-outline';

const useStyles = makeStyles((theme) => ({
  root: { width: '100%' },
  dropZone: {
    outline: 'none',
    display: 'flex',
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(5, 0),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('padding'),
    backgroundColor: theme.palette.background.neutral,
    border: `1px dashed ${theme.palette.grey[500_32]}`,
    '&:hover': {
      opacity: 0.72,
      cursor: 'pointer'
    },
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
      flexDirection: 'row'
    }
  },
  hasFile: {
    padding: '12% 0'
  },
  isDragActive: {
    opacity: 0.72
  },
  isDragReject: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.light,
    backgroundColor: theme.palette.error.lighter
  },
  isDragAccept: {}
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  caption: PropTypes.string,
  error: PropTypes.bool,
  file: PropTypes.object,
  setFile: PropTypes.func,
  className: PropTypes.string
};

function UploadSingleFile({
  caption,
  error = false,
  value: file,
  onChange: setFile,
  className,
  ...other
}) {
  const classes = useStyles();
  const theme = useTheme();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      let file = acceptedFiles[0];

      if (file) {
        setFile({
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFile]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept
  } = useDropzone({ onDrop: handleDrop, multiple: false });

  useEffect(
    () => () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    },
    [file]
  );

  return (
    <div className={clsx(classes.root, className)} {...other}>
      <div
        className={clsx(classes.dropZone, {
          [classes.isDragActive]: isDragActive,
          [classes.isDragAccept]: isDragAccept,
          [classes.isDragReject]: isDragReject || error,
          [classes.hasFile]: file
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <Box sx={{ height: 160, width: 160 }}>
          <Icon
            color={theme.palette.primary.main}
            width={160}
            height={160}
            icon={editIcon}
          />
        </Box>

        <Box sx={{ ml: { md: 5 } }}>
          <Typography gutterBottom variant="h5">
            Drop or Select file
          </Typography>

          {caption ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {caption}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Drop files here or click&nbsp;
              <Typography
                variant="body2"
                component="span"
                sx={{ color: 'primary.main' }}
              >
                browse
              </Typography>
              &nbsp;thorough your machine
            </Typography>
          )}
        </Box>

        {file && (
          <Box
            component="img"
            alt="file preview"
            src={file.preview}
            sx={{
              top: 8,
              borderRadius: 1,
              objectFit: 'cover',
              position: 'absolute',
              width: 'calc(100% - 16px)',
              height: 'calc(100% - 16px)'
            }}
          />
        )}
      </div>
    </div>
  );
}

export default UploadSingleFile;
