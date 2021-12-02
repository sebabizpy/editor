import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';
import { automationApi } from './rtk/automationApi';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }).concat(automationApi.middleware);
    //.concat(logger);
  }
});

setupListeners(store.dispatch);

const persistor = persistStore(store);

export { store, persistor };
