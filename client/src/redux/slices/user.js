import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  errorDetail: {},
  changed: 'none',
  editingUser: null,
  userList: [],
  notifications: null
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    onChangeStatus(state, action) {
      state.isLoading = false;
      state.changed = action.payload;
    },
    setUserToEdit(state, action) {
      state.editingUser = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = true;
      state.errorDetail = action.payload;
    },
    // RESET ERROR
    resetError(state, action) {
      state.isLoading = false;
      state.error = false;
      state.errorDetail = {};
    },
    // GET MANAGE USERS
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },
    // CREATE USER
    stopLoading(state) {
      state.isLoading = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onChangeStatus, setUserToEdit } = slice.actions;

// ----------------------------------------------------------------------
export function updateUser(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`/api/user/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      dispatch(slice.actions.setUserToEdit(null));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getNotifications(data) {
  return async (dispatch) => {};
}

export function getProfile(data) {
  return async (dispatch) => {};
}

// ----------------------------------------------------------------------
export function deleteUser(userId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/user/${userId}`);
      dispatch(getUserList(null));
      dispatch(slice.actions.onChangeStatus('deleted'));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function createUser(user) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/user/', user);
      dispatch(slice.actions.onChangeStatus('created'));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUserList(key) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let url = `/api/user/search/${key}`;
      if (key === null || key.toString().trim() === '') {
        url = '/api/user/search/_all_';
      }
      const response = await axios.get(url);
      dispatch(slice.actions.getUserListSuccess(response.data.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      dispatch(slice.actions.hasError(error.response));
    }
  };
}
