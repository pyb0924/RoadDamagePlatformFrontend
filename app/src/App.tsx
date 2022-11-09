import React from 'react';
import {Provider} from 'react-redux';

import {store} from './store/store';
import LoginPage from './pages/login';

const App = () => {
  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
};

export default App;
