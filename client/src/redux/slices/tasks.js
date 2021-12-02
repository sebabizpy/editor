import axios from '../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: false,
  errorDetails: {},
  currentTask: undefined,
  notifications: null,
  tasksList: [],
  idSelected: -1,
  interval: 10000,
  changed: 'none'
};

// facts { id y status , lo de mas lo saca del task}

const slice = createSlice({
  name: 'task',
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

    setInterval(state, action) {
      state.interval = action.payload;
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
    setTasksList(state, action) {
      state.isLoading = false;
      state.tasksList = action.payload;
    },

    setTask(state, action) {
      state.isLoading = false;
      state.currentTask = action.payload;
    },

    setIdSelected(state, action) {
      state.isLoading = false;
      state.idSelected = action.payload;
    },

    stopLoading(state) {
      state.isLoading = false;
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setInterval,
  setTasksList
} = slice.actions;

export function deleteTask(taskId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/task/${taskId}`);
      dispatch(getTasksList(null));
      dispatch(slice.actions.onChangeStatus('deleted'));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTasksList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/tasks/search/_all_`);
      dispatch(slice.actions.setTaskList(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTasksListByRunId(runId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/tasks/run/${runId}`);
      dispatch(slice.actions.setTaskList(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function patchTask(data, callOnSubmitted) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.patch(`/api/task/${data.id}`, data);
      dispatch(slice.actions.onChangeStatus('updated'));
      dispatch(slice.actions.setTask(resp.data));
      callOnSubmitted(true);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callOnSubmitted(false);
    }
  };
}

export function getTaskById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const resp = await axios.get(`/api/task/${id}`);
      dispatch(slice.actions.setTask(resp.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}