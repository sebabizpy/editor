import React from 'react';
import { camelCase } from 'change-case';
import PropTypes from 'prop-types';

ShowUser.propTypes = {
  user: PropTypes.object
};

export function ShowUser({ user }) {
  return <>{showUser(user)}</>;
}

export function showUser(user) {
  if ( user?.firstName &&  user?.lastName  ) {
    return `${camelCase(user.firstName)} ${camelCase(user.lastName)}`;
  }
  console.log('No name');
  return ``;
}

RoleValidator.propTypes = {
  user: PropTypes.object,
  minRole: PropTypes.object
};

export function RoleValidator({ user, minRole, children }) {
/*   console.log(' USER ' + user.role);
  console.log('RoleToInt(user.role) ' + RoleToInt(user.role));
  console.log('minRole ' + JSON.stringify(minRole));
  console.log('RoleToInt(user.role) >= minRole.n ' + RoleToInt(user.role) >= minRole.n);  
 */
  if (RoleToInt(user.role) >= minRole.n) {
    return <>{children}</>;
  } else {
    return <></>;
  }
}

export const ROLE = {
  user: { name: 'USER', n: 0 },
  engineer: { name: 'ENGINEER', n: 1 },
  approver: { name: 'APPROVER', n: 2 },
  admin: { name: 'ADMIN', n: 3 }
};

function RoleToInt(role) {
  switch (role) {
    case ROLE.engineer.name:
      return ROLE.engineer.n;
    case ROLE.approver.name:
      return ROLE.approver.n;
    case ROLE.user.name:
      return ROLE.user.n;
    case ROLE.admin.name:
      return ROLE.admin.n;
    default:
      return 0;
  }
}
