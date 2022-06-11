import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from 'components';
import reportWebVitals from './reportWebVitals';
import store, { StoreContext } from './store';
import * as toastr from 'toastr';

import 'toastr/build/toastr.css';

import './styles/global.scss';

// @ts-ignore
toastr.options = {
    positionClass: 'toast-bottom-right',
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <StoreContext.Provider value={store}>
          <App />
      </StoreContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
