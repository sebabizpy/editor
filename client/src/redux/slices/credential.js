import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, closeDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentCredential: undefined,
  notifications: null,
  credentialList: [],
  idSelected: -1
};

const slice = createSlice({
  name: 'credential',
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
    setCredential(state, action) {
      state.isLoading = false;
      state.currentCredential = action.payload;
    },

    setCredentialList(state, action) {
      state.isLoading = false;
      state.credentialList = action.payload;
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
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { resetError, startLoading, setIdSelected } = slice.actions;

// DEFAULTS

const errorDialog = new ErrorDialog();
errorDialog.title = 'Error';
errorDialog.msg = 'Error';
errorDialog.acceptBtnMsg = 'Close';

export function deleteCredential(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle response.
      await axios.delete(`/api/credential/${id}`);
      dispatch(getCredentialsList(null));
      dispatch(slice.actions.onChangeStatus('borrado'));
    } catch (error) {
      errorDialog.acceptBtnClickFn = (evt) => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function getCredentialsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/credential/search/_all_`, body);
      dispatch(slice.actions.setCredentialList(response.data.data));
    } catch (error) {
      errorDialog.msg = 'Error creating or updating a credential';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function saveCredential(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle the response.
      await axios.post(`/api/credential`, body);
      callOnSubmitted();
    } catch (error) {
      errorDialog.msg = 'Error creating or updating a credential';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
      callOnSubmitted();
    }
  };
}
