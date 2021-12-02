// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS = {
  auth: '/auth',
  app: '/app',
  assets: '/assets',
  cruds: '/entities',
  compliance: '/compliance',
  remediation: '/remediation',
  network_audit: '/network_audit',
  reports: '/reportes',
  admin: '/admin'
};

export const PATH_PAGE = {
  auth: {
    root: ROOTS.auth,
    login: path(ROOTS.auth, '/login'),
    loginUnprotected: path(ROOTS.auth, '/login-unprotected'),
    register: path(ROOTS.auth, '/register'),
    registerUnprotected: path(ROOTS.auth, '/register-unprotected'),
    resetPassword: path(ROOTS.auth, '/reset-password'),
    verify: path(ROOTS.auth, '/verify')
  },
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  account: '/account'
};




export const PATH_GENERAL = {
  root: ROOTS.cruds,
  entities: {
    users: path(ROOTS.cruds, '/users'),
    add_users: path(ROOTS.cruds, '/users/create'),
    user_credentials: path(ROOTS.cruds, '/credentials'),
    add_credentials: path(ROOTS.cruds, '/credentials/new'),
    groups: path(ROOTS.cruds, '/groups'),
    groups_detail: path(ROOTS.cruds, '/groups/detail'),
    account: path(ROOTS.cruds, '/account')
  }
};

export const PATH_COMPLIANCE = {
  root: ROOTS.compliance,
  compliance: {
    // Compliance.
    bugs: path(ROOTS.compliance, '/bugs'),
    bug: path(ROOTS.compliance, '/bugs/:bugId'),
    vulnerabilities: path(ROOTS.compliance, '/vulnerabilities'),
    vulnerability: path(ROOTS.compliance, '/vulnerabilities/:vulnId')
  }
};

export const PATH_APP = {
  root: ROOTS.app,
  general: {
    remediation: path(ROOTS.app, '/remediation_dashboard'),
    lifecycle: path(ROOTS.app, '/lifecycle_dashboard'),
    alerts: path(ROOTS.app, '/alerts_dashboard')
  }
};
