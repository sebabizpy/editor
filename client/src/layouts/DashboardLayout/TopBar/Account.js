import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';
import MyAvatar from '../../../components/MyAvatar';
import React, { useRef, useState } from 'react';
import PopoverMenu from '../../../components/PopoverMenu';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { useHistory, Link as RouterLink} from 'react-router-dom';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { Button, Box, Divider, Typography, MenuItem } from '@material-ui/core';
import { MIconButton } from '../../../theme';
import { Icon } from '@iconify/react';
import userIcon from '@iconify-icons/healthicons/ui-user-profile';
import { PATH_APP, PATH_GENERAL } from '../../../routes/paths';

const useStyles = makeStyles((theme) => ({
  btnAvatar: {
    padding: 0,
    width: 44,
    height: 44
  },
  isSelected: {
    '&:before': {
      zIndex: 1,
      content: "''",
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      position: 'absolute',
      background: alpha(theme.palette.grey[900], 0.8)
    }
  }
}));

function Account() {
  const classes = useStyles();
  const history = useHistory();
  const anchorRef = useRef(null);
  const { user, logout } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (isMountedRef.current) {
        history.push('/');
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout', { variant: 'error' });
    }
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        className={clsx(classes.btnAvatar, { [classes.isSelected]: isOpen })}
      >
        <MyAvatar />
      </MIconButton>

      <PopoverMenu
        width={220}
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ my: 2, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
            key={'Profile'}
            to={PATH_GENERAL.entities.account}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={userIcon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {'Profile'}
          </MenuItem>
        {/*
        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}*/}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </PopoverMenu>
    </>
  );
}

export default Account;
