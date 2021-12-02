import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { ErrorDialog, startDialog, closeDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  currentComponent: undefined,
  notifications: null,
  componentsList: [],
  idSelected: -1,
  changed: 'none',
  pi: 3000
};

// facts { id y status , lo de mas lo saca del component}

const slice = createSlice({
  name: 'component',
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
    resetError(state) {
      state.isLoading = false;
      state.error = false;
      state.errorDetail = {};
    },
    onChangeStatus(state, action) {
      state.isLoading = false;
      state.changed = action.payload;
    },
    setComponentList(state, action) {
      state.isLoading = false;
      state.componentsList = action.payload;
    },

    setComponent(state, action) {
      state.isLoading = false;
      state.currentComponent = action.payload;
    },

    setIdSelected(state, action) {
      state.isLoading = false;
      state.idSelected = action.payload;
    },

    stopLoading(state) {
      state.isLoading = false;
    },
    setPi(state, action) {
      state.pi = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetError,
  startLoading,
  stopLoading,
  setComponent,
  setDiscovery,
  setIdSelected,
  onChangeStatus,
  setStatus,
  setPi
} = slice.actions;

export const componentStatus = {
  DISCOVERING: 'DISCOVERING',
  DISCOVERED: 'DISCOVERED',
  NEW: 'NEW'
};


export function getComponentsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/components/search/_all_`, body);
      dispatch(slice.actions.setComponentList(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveComponent(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/component`, body);
      dispatch(slice.actions.onChangeStatus('created'));
      callOnSubmitted(true);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(error.response)
        console.log(error)
        let ed = new ErrorDialog(
          'Error discovering Component, check credentials and network address.',
          'Error creating Component',
          'Ok'
        );
        ed.acceptBtnClickFn = () => {
          dispatch(closeDialog());
        };
        dispatch(startDialog(ed));
      }
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}

export function patchComponent(data, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.patch(`/api/component/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      console.log(`### ${JSON.stringify(resp.data)}`)
      dispatch(slice.actions.setComponent(resp.data));
      callOnSubmitted(true);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}

export function getComponentById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.get(`/api/component/${id}`);
      console.log(`### ${JSON.stringify(resp.data)}`)
      dispatch(slice.actions.setComponent(resp.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}