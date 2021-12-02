import { PATH_GENERAL  } from './paths';
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import AuthProtect from '../components/Auth/AuthProtect';
import DashboardLayout from '../layouts/DashboardLayout';

const GeneralRoutes = {
  path: PATH_GENERAL.root,
  guard: AuthProtect,
  layout: DashboardLayout,
  routes: [
    // GENERAL
    {
      exact: true,
      path: PATH_GENERAL.entities.users,
      component: lazy(() => import('../views/pages/UserView/Main'))
    },
    {
      exact: true,
      path: PATH_GENERAL.entities.add_users,
      component: lazy(() => import('../views/pages/UserView/CreateView'))
    },
    {
      exact: true,
      path: PATH_GENERAL.entities.account,
      component: lazy(() => import('../views/pages/AccountView'))
    },
    {
      component: () => <Redirect to="/404" />
    }
  ]
};

export default GeneralRoutes;
