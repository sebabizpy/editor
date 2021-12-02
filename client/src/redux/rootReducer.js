import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productReducer from './slices/product';
import authJwtReducer from './slices/authJwt';
import notificationsReducer from './slices/notifications';
import settingsReducer from './slices/settings';
import assetReducer from './slices/assets';
import policiesReducer from './slices/policies';
import credentialsReducer from './slices/credential';
import changeRequestReducer from './slices/change_request';
import issuesReducer from './slices/issues';
import groupReducer from './slices/group';
import errorDialog from './slices/errorDialog';
import userReducer from './slices/user';
import vulnerabilitiesReducer from './slices/vulnerabilities';
import bugReducer from './slices/bugs';
import componentReducer from './slices/component';
import configReducer from './slices/config';
import taskReducer from './slices/tasks';
import { automationApi } from './rtk/automationApi';
// ----------------------------------------------------------------------
// TODO: persistir los paginados, en algun momento
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  keyPrefix: 'redux-',
  whitelist: ['settings']
};

const productPersistConfig = {
  key: 'product',
  storage: storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const assetPersistConfig = {
  key: 'asset',
  storage: storage,
  keyPrefix: 'redux-',
  whitelist: ['currentAsset']
};

const authPersistConfig = {
  key: 'authJwt',
  storage: storage,
  keyPrefix: 'redux-',
  whitelist: ['isAuthenticated']
};

const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationsReducer,
  errorDialog: errorDialog,
  credential: credentialsReducer,
  change_request: changeRequestReducer,
  issue: issuesReducer,
  group: groupReducer,
  policies: policiesReducer,
  bug: bugReducer,
  vulnerability: vulnerabilitiesReducer,
  settings: settingsReducer,
  config: configReducer,
  component: componentReducer,
  task: taskReducer,
  api: automationApi.reducer,
  asset: persistReducer(assetPersistConfig, assetReducer),
  product: persistReducer(productPersistConfig, productReducer),
  authJwt: persistReducer(authPersistConfig, authJwtReducer)
});

export { rootPersistConfig, rootReducer };
