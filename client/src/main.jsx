import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';

import App from '@containers/App';
import Language from '@containers/Language';

import store, { persistor } from '@store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Language>
        <BrowserRouter>
          <Toaster
            toastOptions={{
              style: {
                fontSize: '0.75rem',
              },
            }}
          />
          <App />
        </BrowserRouter>
      </Language>
    </PersistGate>
  </Provider>
);
