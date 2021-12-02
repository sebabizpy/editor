import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, closeDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentBug: undefined,
  notifications: null,
  bugList: [],
  idSelected: -1
};

const slice = createSlice({
  name: 'bug',
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
    setBug(state, action) {
      state.isLoading = false;
      state.currentBug = action.payload;
    },

    setBugList(state, action) {
      state.isLoading = false;
      state.bugList = action.payload;
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


export function getBugsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/compliance/bugs/count/`, body);
      console.log("response.data "+ JSON.stringify(response.data.data))
      dispatch(slice.actions.setBugList(response.data.data));
    } catch (error) {
      errorDialog.msg = 'Error searching bugs';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function saveBug(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle the response.
      await axios.post(`/api/bug`, body);
      callOnSubmitted();
    } catch (error) {
      errorDialog.msg = 'Error creating or updating a Bug';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
      callOnSubmitted();
    }
  };
}
