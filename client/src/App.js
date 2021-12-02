/* eslint-disable prettier/prettier */
import React from 'react';
import { ThemeConfig } from './theme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { store, persistor } from './redux/store';
import routes, { renderRoutes } from './routes';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import NotistackProvider from './components/NotistackProvider';
import { PersistGate } from 'redux-persist/lib/integration/react';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

// Using for Auth (Check doc https://minimals.cc/docs/authentication)
import JwtProvider from './components/Auth/JwtProvider';
import ErrorProvider from './components/ErrorProvider';
// import FirebaseProvider from 'src/components/Auth/FirebaseProvider';

// ----------------------------------------------------------------------

const history = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ThemeConfig>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <NotistackProvider>
              <ErrorProvider>
                <Router history={history}>
                  <JwtProvider>
                    <ScrollToTop />
                    {renderRoutes(routes)}
                  </JwtProvider>
                </Router>
              </ErrorProvider>
            </NotistackProvider>
          </LocalizationProvider>
        </ThemeConfig>
      </PersistGate>
    </Provider>
  );
}

export default App;
