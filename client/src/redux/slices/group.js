import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { startDialog, closeDialog, ErrorDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  status: '',
  currentGroup: undefined,
  notifications: null,
  groupList: [],
  idSelected: -1
};

const slice = createSlice({
  name: 'group',
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
    setGroupSelected(state, action) {
      state.isLoading = false;
      state.currentGroup = action.payload;
    },

    setGroupList(state, action) {
      state.isLoading = false;
      state.groupList = action.payload;
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
export const { resetError, startLoading, setGroupSelected, setIdSelected } = slice.actions;

// DEFAULTS

const errorDialog = new ErrorDialog();
errorDialog.title = 'Error';
errorDialog.msg = 'Error';
errorDialog.acceptBtnMsg = 'Close';

export function deleteGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle response.
      await axios.delete(`/api/group/${id}`);
      dispatch(getGroupsList(null));
      dispatch(slice.actions.onChangeStatus('borrado'));
    } catch (error) {
      errorDialog.acceptBtnClickFn = (evt) => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function getGroupsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/group/search/_all_`, body);
      dispatch(slice.actions.setGroupList(response.data.data));
    } catch (error) {
      errorDialog.msg = 'Error creating or updating a group';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
    }
  };
}

export function saveGroup(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // TODO: handle the response.
      await axios.post(`/api/group`, body);
      callOnSubmitted();
    } catch (error) {
      errorDialog.msg = 'Error creating or updating a group';
      errorDialog.acceptBtnClickFn = () => {
        dispatch(closeDialog());
      };
      dispatch(startDialog(errorDialog));
      callOnSubmitted();
    }
  };
}
