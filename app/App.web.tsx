import React from 'react';
import {Provider} from 'react-redux';
import StyleSheet from 'react-native';

import {ThemeProvider} from '@rneui/themed';

import LoginView from './pages/login';
import {rootStore} from './store/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Provider store={rootStore}>
          <LoginView />
        </Provider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
