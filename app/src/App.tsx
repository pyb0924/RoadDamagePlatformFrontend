import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {useFlipper} from '@react-navigation/devtools';
import {PersistGate} from 'redux-persist/integration/react';

import {ThemeProvider} from '@rneui/themed';

import {persistor, store} from './store/store';
import MainScreen from './screens';
import {initAmapGeolocation} from './utils';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);

  useEffect(() => {
    initAmapGeolocation();
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <MainScreen />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
