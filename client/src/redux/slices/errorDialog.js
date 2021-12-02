import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export class ErrorDialog {
  constructor(msg = 'Error', title = 'Error', acceptBtnMsg = 'Close') {
    this.reset();
    this.title = title;
    this.msg = msg;
    this.acceptBtnMsg = acceptBtnMsg;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get msg() {
    return this._msg;
  }

  set msg(value) {
    this._msg = value;
  }

  get cancelBtnMsg() {
    return this._cancelBtnMsg;
  }

  set cancelBtnMsg(value) {
    this._cancelBtnMsg = value;
  }

  get acceptBtnMsg() {
    return this._acceptBtnMsg;
  }

  set acceptBtnMsg(value) {
    this._acceptBtnMsg = value;
  }

  get cancelBtnClickFn() {
    return this._cancelBtnClickFn;
  }

  set cancelBtnClickFn(value) {
    this._cancelBtnClickFn = value;
  }

  get acceptBtnClickFn() {
    return this._acceptBtnClickFn;
  }

  set acceptBtnClickFn(value) {
    this._acceptBtnClickFn = value;
  }

  get onCloseFn() {
    return this._onCloseFn;
  }

  set onCloseFn(value) {
    this._onCloseFn = value;
  }
  reset() {
    this._title = '';
    this._msg = '';
    this._cancelBtnMsg = '';
    this._acceptBtnMsg = '';
    this._cancelBtnClickFn = undefined;
    this._acceptBtnClickFn = undefined;
    this._onCloseFn = undefined;
  }
}

const initialState = {
  openDialog: false,
  dialog: new ErrorDialog()
};

const slice = createSlice({
  name: 'errorDialog',
  initialState,
  reducers: {
    startDialog(state, action) {
      state.dialog = action.payload;
      state.openDialog = true;
    },

    closeDialog(state, action) {
      state.openDialog = false;
      state.dialog = new ErrorDialog();
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { startDialog, closeDialog } = slice.actions;
