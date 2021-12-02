

import General from './General';
import { Icon } from '@iconify/react';
import Page from '../../../components/Page';
import { capitalCase } from 'change-case';
import Notifications from './Notifications';
import { PATH_APP } from '../../../routes/paths';
import ChangePassword from './ChangePassword';
import React, { useState, useEffect } from 'react';
import bellFill from '@iconify-icons/eva/bell-fill';
import { useDispatch, useSelector } from 'react-redux';
import roundVpnKey from '@iconify-icons/ic/round-vpn-key';
import { HeaderDashboard } from '../../../layouts/Common';
import roundAccountBox from '@iconify-icons/ic/round-account-box';
import { getProfile, getNotifications } from '../../../redux/slices/user';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Tab, Box, Tabs } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(5)
  }
}));

// ----------------------------------------------------------------------

function Main() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();
  const {
    notifications
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getNotifications());
    dispatch(getProfile());
  }, [dispatch]);

 /*  if (!myProfile) {
    return null;
  }

  if (!cards) {
    return null;
  }

  if (!notifications) {
    return null;
  }
 */
  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <General />
    },
    {
      value: 'notifications',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <Notifications notifications={notifications} />
    },
    {
      value: 'change_password',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <ChangePassword />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page
      title="Account Settings-Management | Minimal-UI"
      className={classes.root}
    >
      <Container>
        <HeaderDashboard
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_APP.root },
            { name: 'User', href: PATH_APP.root },
            { name: 'Account Settings' }
          ]}
        />

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
          className={classes.tabBar}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}

export default Main;
