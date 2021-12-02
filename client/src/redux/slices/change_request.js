import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentChangeRequest: undefined,
  notifications: null,
  changeRequestList: [],
  idSelected: -1
};

const slice = createSlice({
  name: 'change_request',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
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

    // SET SAVED ASSET
    setChangeRequest(state, action) {
      state.isLoading = false;
      state.currentChangeRequest = action.payload;
    },

    setChangeRequestList(state, action) {
      state.isLoading = false;
      state.changeRequestList = action.payload;
    },

    setIdSelected(state, action) {
      state.isLoading = false;
      state.idSelected = action.payload;
    },

    stopLoading(state) {
      state.isLoading = false;
    },
    onChangeStatus(state, action) {
      state.status = action.payload;
      state.isLoading = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetError,
  startLoading,
  setIdSelected,
  setChangeRequest
} = slice.actions;

// DEFAULTS

export function deleteChangeRequest(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle response.
      await axios.delete(`/api/change_request/${id}`);
      dispatch(getChangeRequestsList(null));
      dispatch(slice.actions.onChangeStatus('deleted'));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      dispatch(startDialog(new ErrorDialog('Error deleting Change Request')));
    }
  };
}

export function getChangeRequestsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/change_requests/_all_`);
      console.log(`getChangeRequestsList ${JSON.stringify(response.data.data)}`)
      dispatch(slice.actions.setChangeRequestList(response.data.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function getChangeRequestsListByAsset(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/change_requests/asset/${id}`);
      console.log(`getChangeRequestsListByAsset ${JSON.stringify(response.data.query.data)}`)
      dispatch(slice.actions.setChangeRequestList(response.data.query.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function saveChangeRequest(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/change_request`, body);
      dispatch(slice.actions.stopLoading());
      callOnSubmitted(true);
    } catch (error) {
      callOnSubmitted(false);
    }
  };

}

export function updateChangeRequest(data, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`/api/change_request/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      dispatch(slice.actions.setChangeRequest(undefined));
      callOnSubmitted(true);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}



