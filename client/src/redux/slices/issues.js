import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, closeDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentIssue: undefined,
  notifications: null,
  issueList: [],
  idSelected: -1
};

const slice = createSlice({
  name: 'issue',
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
    setIssue(state, action) {
      state.isLoading = false;
      state.currentIssue = action.payload;
    },

    setIssueList(state, action) {
      state.isLoading = false;
      state.issueList = action.payload;
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
  setIssue
} = slice.actions;

// DEFAULTS

/* export function deleteIssue(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle response.
      await axios.delete(`/api/issue/${id}`);
      dispatch(getIssuesList(null));
      dispatch(slice.actions.onChangeStatus('deleted'));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      dispatch(startDialog(new ErrorDialog('Error deleting issue')));
    }
  };
} */

export function getIssuesList(asset) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    let url = `/api/issues/_all_`
    try {
      if (asset) {
        url = `/api/issue/asset/${asset.id}`
      }
      const response = await axios.get(url);
      dispatch(slice.actions.setIssueList(response.data.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function saveIssue(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle the response
      await axios.post(`/api/issue`, body);
      callOnSubmitted(true);
    } catch (error) {
      callOnSubmitted(false);
    }
  };

}

export function updateIssue(data, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`/api/issue/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      dispatch(slice.actions.setIssue(undefined));
      callOnSubmitted(true);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}



