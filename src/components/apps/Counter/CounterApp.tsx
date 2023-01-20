import React from 'react';
import store from './store';
import { Provider } from 'react-redux';

import RelayInterface from './RelayInterface';
import StatusPoller from './StatusPoller';


const CounterApp = () => {
  return (
    // Give the whole counter app access to redux store
    <Provider store={store}>
      <RelayInterface />
      <StatusPoller />
    </Provider >
  )
}

export default CounterApp