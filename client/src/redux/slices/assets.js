import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { ErrorDialog, startDialog, closeDialog } from './errorDialog';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  currentAsset: undefined,
  notifications: null,
  assetsList: [],
  idSelected: -1,
  changed: 'none',
  pi: 3000
};

// facts { id y status , lo de mas lo saca del asset}

const slice = createSlice({
  name: 'asset',
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
    setAssetList(state, action) {
      state.isLoading = false;
      state.assetsList = action.payload;
    },

    setAsset(state, action) {
      state.isLoading = false;
      state.currentAsset = action.payload;
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
  setAsset,
  setDiscovery,
  setIdSelected,
  onChangeStatus,
  setStatus,
  setPi
} = slice.actions;

export const assetStatus = {
  DISCOVERING: 'DISCOVERING',
  DISCOVERED: 'DISCOVERED',
  NEW: 'NEW'
};

export function deleteAsset(assetId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/asset/${assetId}`);
      dispatch(getAssetsList(null));
      dispatch(slice.actions.onChangeStatus('deleted'));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAssetsList(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/assets/search/_all_`, body);
      dispatch(slice.actions.setAssetList(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveAsset(body, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/asset`, body);
      dispatch(slice.actions.onChangeStatus('created'));
      callOnSubmitted(true);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(error.response)
        console.log(error)
        let ed = new ErrorDialog(
          'Error discovering Asset, check credentials and network address.',
          'Error creating Asset',
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

export function patchAsset(data, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.patch(`/api/asset/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      console.log(`### ${JSON.stringify(resp.data)}`)
      dispatch(slice.actions.setAsset(resp.data));
      callOnSubmitted(true);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}

export function getAssetById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.get(`/api/asset/${id}`);
      console.log(`### ${JSON.stringify(resp.data)}`)
      dispatch(slice.actions.setAsset(resp.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}