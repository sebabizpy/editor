import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  errorDetail: {},
  changed: 'none',
  editingProduct: null,
  productList: [],
  notifications: null
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    onChangeStatus(state, action) {
      state.isLoading = false;
      state.changed = action.payload;
    },
    setProductToEdit(state, action) {
      state.editingProduct = action.payload;
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
    // GET MANAGE productS
    getProductListSuccess(state, action) {
      state.isLoading = false;
      state.productList = action.payload;
    },
    // CREATE product
    stopLoading(state) {
      state.isLoading = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onChangeStatus, setProductToEdit } = slice.actions;

// ----------------------------------------------------------------------
export function updateProduct(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`/api/product/local/${data.selected}`, data.product);
      dispatch(slice.actions.onChangeStatus('actualizado'));
      dispatch(slice.actions.setProductToEdit(null));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function deleteProduct(productId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/product/local/${productId}`);
      dispatch(getProductList(null));
      dispatch(slice.actions.onChangeStatus('borrado'));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function createProduct(product) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/product/local/', product);
      dispatch(slice.actions.onChangeStatus('creado'));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProductList(key) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let url = `/api/product/local/${key}`;
      if (key === null || key.toString().trim() === '') {
        url = '/api/product/local/_all_';
      }
      const response = await axios.get(url);
      dispatch(slice.actions.getProductListSuccess(response.data.data));
    } catch (error) {
      if (error.response.status === 404) {
        dispatch(slice.actions.getProductListSuccess([]));
      }
      // TODO: como atajo esto!!!!@!@!@!@!!!!!
      dispatch(slice.actions.hasError(error.response));
    }
  };
}
