import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { decode } from 'jsonwebtoken';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  token: undefined,
  user: {},
  error: null
};

const slice = createSlice({
  name: 'authJwt',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // INITIALISE
    getInitialize(state, action) {
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = mapUser(action.payload.user);
    },

    // LOGIN
    loginSuccess(state, action) {
      console.info('### Login success ' + JSON.stringify(action.payload));
      state.isAuthenticated = true;
      state.user = mapUser(action.payload.user);
      state.token = action.payload.access_token;
    },
    // LOGIN
    reset(state, action) {
      state.error = null;
    },
    // LOGIN Failed
    loginFailed(state, action) {
      console.error('Login Failed');
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // REGISTER
    registerSuccess(state, action) {
      console.error('registerSuccess' + JSON.stringify(action.payload));
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
    },
    // LOGOUT
    logoutSuccess(state) {
      console.error('logoutSuccess');
      state.isAuthenticated = false;
      state.token = undefined;
      state.user = null;
    }
  }
});

// Reducer
export default slice.reducer;

export const { reset } = slice.actions;

function mapUser(back) {
  if (!back) {
    return null;
  }
  let user = {
    id: -1,
    displayName: 'Seba',
    email: 'sebastian@pipi.com',
    photoURL: '/static/images/avatars/avatar_default.jpg',
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: '',
    group: {},
    role: 'admin',
    isPublic: true
  };
  user.id = back.id;
  user.displayName = `${back.firstName} ${back.lastName}`;
  user.email = back.email;
  // change
  user.photoURL = '/static/images/avatars/avatar_default.jpg';
  user.role = back.role;
  user.group = back.group;
  console.log(`## USER ${JSON.stringify(user)}`)
  return user;
}

// ----------------------------------------------------------------------

function getToken(accessToken) {
  if (!accessToken) {
    return [false, 0];
  }
  // DECODE ESTA MAL no existe,.
  const decoded = decode(accessToken);
  const currentTime = Date.now() / 1000;

  return [decoded.exp > currentTime, decoded.sub];
}

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ----------------------------------------------------------------------

export function login({ email, password }) {
  return async (dispatch) => {
    const response = await axios.post('/api/autho', {
      email,
      password
    });
    if (response && response.status === 200) {
      const { access_token, user } = response.data;
      setSession(access_token);
      dispatch(slice.actions.loginSuccess({ user, access_token }));
    } else {
      dispatch(
        slice.actions.loginFailed({
          message: 'No se pudo logear con esas credenciales'
        })
      );
    }
  };
}

// ----------------------------------------------------------------------

export function register({ email, password, firstName, lastName }) {
  return async (dispatch) => {
    // TODO: change this endpoint since it won't return an accessToken
    // It works but you need to refresh and login.
    const response = await axios.post('/api/user', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch(slice.actions.registerSuccess({ user, accessToken }));
  };
}

// ----------------------------------------------------------------------

export function logout() {
  return async (dispatch) => {
    setSession(null);

    dispatch(slice.actions.logoutSuccess());
  };
}

// ----------------------------------------------------------------------

export function getInitialize() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      let [valid, id] = getToken(accessToken);
      if (valid) {
        console.error('getInitialize setSession valid');
        setSession(accessToken);

        const response = await axios.get(`/api/user/${id}`);
        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: true,
            user: response.data
          })
        );
      } else {
        console.error('getInitialize setSession !valid');
        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: false,
            user: null
          })
        );
      }
    } catch (error) {
      console.error('getInitialize ' + error);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null
        })
      );
    }
  };
}
