import clsx from 'clsx';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useIsMountedRef from '../../../../../hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Box,
  Card,
  CardContent,
  Grid
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { saveConfig } from '../../../../../redux/slices/config';
import { useSnackbar } from 'notistack';

import ReactDiffViewer from 'react-diff-viewer';


function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 1,
        m: 1,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const oldCode = `!
! Last configuration change at 19:33:37 UTC Mon Nov 15 2021 by Sebastian
version 15.3
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
!
hostname R1941
!
boot-start-marker
boot system flash0:c1900-universalk9-mz.SPA.157-3.M9.bin
boot-end-marker
!
!
no aaa new-model
!
!
!
!
!
!
!
ip domain name rtp.cisco.com
ip cef
no ipv6 cef
multilink bundle-name authenticated
!
!
!
license udi pid CISCO1941/K9 sn FCZ192491FG
hw-module usb disable
!
!
username cisco password 0 ary123!$
username Sebastian privilege 15 password 0 ary123!$
!
redundancy
!
!
ip ssh authentication-retries 2
ip ssh version 2
ip ssh pubkey-chain
  username cisco
  username Sebastian
!
!
!
!
!
!
!         
interface Embedded-Service-Engine0/0
 no ip address
 shutdown
!
interface GigabitEthernet0/0
 description Test2
 ip address 192.168.100.104 255.255.255.0
 ip nat inside
 ip virtual-reassembly in
 duplex auto
 speed auto
!
interface GigabitEthernet0/1
 description not in use
 ip address dhcp
 ip nat outside
 ip virtual-reassembly in
 duplex auto
 speed auto
!
ip forward-protocol nd
!
no ip http server
no ip http secure-server
!
ip nat inside source list 1 interface GigabitEthernet0/1 overload
ip route 0.0.0.0 0.0.0.0 23.125.42.1
!
!
!
access-list 1 permit 192.168.1.0 0.0.0.255
!
control-plane
!
!
!
line con 0
line aux 0
line 2
 no activation-character
 no exec
 transport preferred none
 transport output pad telnet rlogin lapb-ta mop udptn v120 ssh
 stopbits 1
line vty 0 4
 privilege level 15
 login local
 transport input all
line vty 5 15
 login
 transport input all
!
scheduler allocate 20000 1000
!
end`;

const newCode = `!
! Last configuration change at 19:33:37 UTC Mon Nov 15 2021 by Sebastian
version 15.3
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
!
hostname R1941
!
boot-start-marker
boot system flash0:c1900-universalk9-mz.SPA.157-3.M9.bin
boot-end-marker
!
!
!
no aaa new-model
!
!
!
!
!
!
!
ip domain name rtp.cisco.com
ip cef
no ipv6 cef
multilink bundle-name authenticated
!
!
!
license udi pid CISCO1941/K9 sn FCZ192491FG
hw-module usb disable
!
!
username cisco password 0 ary123!$
username Sebastian privilege 15 password 0 ary123!$
!
redundancy
!
!
ip ssh authentication-retries 2
ip ssh version 2
ip ssh pubkey-chain
  username cisco
  username Sebastian
!
!
!
!
!
!
!         
interface Embedded-Service-Engine0/0
 ip address
 shutdown
!
interface GigabitEthernet0/0
 description Test2
 ip address 192.168.100.104 255.255.255.1
 ip nat inside
 ip virtual-reassembly in
 duplex auto
 speed auto
!
interface GigabitEthernet0/1
 description not in use
 duplex auto
 speed 122
!
ip forward-protocol nd
!
no ip http server
no ip http secure-server
!
ip nat inside source list 1 interface GigabitEthernet0/1 overload
ip route 0.0.0.0 0.0.0.0 23.125.42.1
!
!
!
access-list 1 permit 192.168.1.0 0.0.0.255
!
control-plane
!
!
!
line con 0
line aux 0
line 2
 no exec
 transport preferred none
 transport output pad telnet rlogin lapb-ta mop udptn v120 ssh
 stopbits 1
line vty 0 4
 privilege level 15
 login local
 transport input all
line vty 5 15
 login
 transport input all
!
scheduler allocate 20000 1000
!
end`;

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

FormView.propTypes = {
  className: PropTypes.string,
  currentConfig: PropTypes.string
};

function FormView({ className }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [id, setId] = useState();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: '',
      protocol: '',
      pass_1: '',
      pass_2: ''
    },
    validationSchema: Yup.object({
      user: Yup.string().required('Enter the username').max(50),
      pass_1: Yup.string().required('Enter the password'),
      pass_2: Yup.string().required('Repeat the password')
    }),

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      function callOnSubmitted() {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }

      try {
        setSubmitting(true);

        if (values.pass_1 !== values.pass_2) {
          setErrors({
            pass_1: 'Enter the same password',
            pass_2: 'Enter the same password'
          });
        } else {
          const vals = {
            id: id,
            user: values.user,
          };

          dispatch(saveConfig(vals, callOnSubmitted));
          resetForm({});
          enqueueSnackbar('Config Created', { variant: 'success' });
        }
      } catch (error) {
        callOnSubmitted();
      }
    }
  });
  const {  handleSubmit, getFieldProps } = formik;
  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Box sx={{ m: 5 }}>
              <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: 30,
                  }}
                >
                  <Button>set version 1</Button>
                  <Button>set version 2</Button>
                </Box>
                <ReactDiffViewer leftTitle={'version 1'} rightTitle={'version 2'} oldValue={oldCode} newValue={newCode} splitView={true} />
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: 30,
                  }}
                >
                  <Button>set version 1</Button>
                  <Button>set version 2</Button>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}



export default FormView;
