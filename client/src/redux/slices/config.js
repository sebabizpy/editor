import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { ErrorDialog, startDialog, closeDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  currentConfig: undefined,
  notifications: null,
  configsList: [],
  idSelected: -1,
  changed: 'none',
  pi: 3000
};

// facts { id y status , lo de mas lo saca del config}

const slice = createSlice({
  name: 'config',
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
    setConfigList(state, action) {
      state.isLoading = false;
      state.configsList = action.payload;
    },

    setConfig(state, action) {
      state.isLoading = false;
      state.currentConfig = action.payload;
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
  setConfig,
  setDiscovery,
  setIdSelected,
  onChangeStatus,
  setStatus,
  setPi
} = slice.actions;

export const configStatus = {
  DISCOVERING: 'DISCOVERING',
  DISCOVERED: 'DISCOVERED',
  NEW: 'NEW'
};


export function getConfigsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/configurations/search/_all_`, body);
      dispatch(slice.actions.setConfigList(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveConfig(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/configuration`, body);
      dispatch(slice.actions.onChangeStatus('created'));
      callOnSubmitted(true);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(error.response)
        console.log(error)
        let ed = new ErrorDialog(
          'Error discovering Config, check credentials and network address.',
          'Error creating Config',
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

export function patchConfig(data, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.patch(`/api/configuration/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      console.log(`### ${JSON.stringify(resp.data)}`)
      dispatch(slice.actions.setConfig(resp.data));
      callOnSubmitted(true);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}

export function getConfigById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.get(`/api/config/${id}`);
      console.log(`### ${JSON.stringify(resp.data)}`)
      dispatch(slice.actions.setConfig(resp.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}