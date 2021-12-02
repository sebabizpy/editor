import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, closeDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentVulnerability: undefined,
  notifications: null,
  vulnerabilityList: [],
  idSelected: -1
};

const slice = createSlice({
  name: 'vulnerability',
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
    setVulnerability(state, action) {
      state.isLoading = false;
      state.currentVulnerability = action.payload;
    },

    setVulnerabilityList(state, action) {
      state.isLoading = false;
      state.vulnerabilityList = action.payload;
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
export const { resetError, startLoading, setIdSelected ,setVulnerability} = slice.actions;

// DEFAULTS

const errorDialog = new ErrorDialog();
errorDialog.title = 'Error';
errorDialog.msg = 'Error';
errorDialog.acceptBtnMsg = 'Close';


export function getVulnerabilitysList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/compliance/vulnerabilities/count`, body);
      console.log("response.data.data "+ response.data.data)
      dispatch(slice.actions.setVulnerabilityList(response.data.data));

    } catch (error) {
      errorDialog.msg = 'Error searching vulnerabilities';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function saveVulnerability(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle the response.
      await axios.post(`/api/vulnerability`, body);
      callOnSubmitted();
    } catch (error) {
      errorDialog.msg = 'Error creating or updating a Vulnerability';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
      callOnSubmitted();
    }
  };
}
