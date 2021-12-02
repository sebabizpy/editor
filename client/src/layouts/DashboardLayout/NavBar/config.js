import React from 'react';
import { MIcon } from '../../../theme';
import {
  PATH_APP,
  PATH_REMEDIATION,
  PATH_ASSETS,
  PATH_GENERAL,
  PATH_NETWORK_AUDIT,
  PATH_COMPLIANCE
} from '../../../routes/paths';

// ----------------------------------------------------------------------

const path = (name) => `/static/icons/navbar/${name}.svg`;

const ICONS = {
  dashboard: <MIcon src={path('ic_dashboard')} />,
  inventory: <MIcon src={path('ic_inventory-2')} />,
  reports: <MIcon src={path('ic_report')} />,
  administration: <MIcon src={path('ic_administration')} />,
  user: <MIcon src={path('ic_user')} />,
  remediation: <MIcon src={path('ic_remediation')} />,
  // TODO: check what icon to use for networkAudit
  networkAudit: <MIcon src={path('ic_network_audit')} />,
  compliance: <MIcon src={path('ic_compliance')} />
};

const navConfig = [

  {
    subheader: 'configuration',
    items: [
      {
        title: 'configuration',
        icon: ICONS.administration,
        href: PATH_GENERAL.root,
        items: [
          {
            title: 'users',
            href: PATH_GENERAL.entities.users
          },
          {
            title: 'my account',
            href: PATH_GENERAL.entities.account
          }
        ]
      }
    ]
  }
];

export default navConfig;
