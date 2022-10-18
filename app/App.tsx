import React from 'react';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@rneui/themed';

import {rootStore} from './store/store';
import LoginPage from './pages/login';
import MapPage from './pages/map';

const App = () => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Provider store={rootStore}>
          <MapPage />
        </Provider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
