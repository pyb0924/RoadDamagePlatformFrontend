import React from 'react';
import {Provider} from 'react-redux';

import {ThemeProvider} from '@rneui/themed';

import LoginView from './pages/login';
import {rootStore} from './store/store';

const App = () => {
  return (
    <ThemeProvider>
      <Provider store={rootStore}>
        <LoginView />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
