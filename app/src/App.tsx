import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';

import {ThemeProvider} from '@rneui/themed';

import {persistor, store} from './store/store';
import MainScreen from './screens';
import {initAmapGeolocation} from './utils';

export default function App() {
  useEffect(() => {
    initAmapGeolocation();
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainScreen />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
