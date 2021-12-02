import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, closeDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentPolicy: undefined,
  notifications: null,
  policiesList: [],
  // a map of policies indexed by id.
  policiesMap: {},
  idSelected: -1
};

const slice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = true;
      state.errorDetail = action.payload;
    },
    resetError(state, action) {
      state.isLoading = false;
      state.error = false;
      state.errorDetail = {};
    },

    setPolicy(state, action) {
      // I only add the policy to the policiesMap
      const policy = action.payload;
      state.policiesMap[policy.id] = policy;
    },

    setPoliciesList(state, action) {
      state.isLoading = false;
      state.policiesList = action.payload;
      (action.payload || []).forEach((policy) => {
        // I need to also insert each action to the policyMap indexed by id.
        state.policiesMap[policy.id] = policy;
      });
    },

    // TODO: check if this is needed.
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
export const {
  resetError,
  startLoading,
  setIdSelected,
  setPolicy
} = slice.actions;

// DEFAULTS

const errorDialog = new ErrorDialog();
errorDialog.title = 'Error';
errorDialog.msg = 'Error';
errorDialog.acceptBtnMsg = 'Close';

export function getPoliciesList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/policies`);

      dispatch(slice.actions.setPoliciesList(response.data.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      console.log(error.response.status);
      dispatch(slice.actions.stopLoading());
      errorDialog.acceptBtnClickFn = (evt) => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function getPolicy(policyId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/policies/${policyId}`);

      dispatch(slice.actions.setPolicy(response.data.data[0])); // TODO: do a safe check.
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      errorDialog.acceptBtnClickFn = (evt) => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function savePolicy(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/policies`,body);
      dispatch(slice.actions.stopLoading());
      callOnSubmitted(true);
    } catch (error) {
      callOnSubmitted(false);
      dispatch(slice.actions.stopLoading());
      errorDialog.msg = 'Error saving policy';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function deletePolicy(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/policies`,body);
      dispatch(slice.actions.stopLoading());
      callOnSubmitted(true);
    } catch (error) {
      callOnSubmitted(false);
      dispatch(slice.actions.stopLoading());
      errorDialog.msg = 'Error saving policy';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}