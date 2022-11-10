import React from 'react';
import {Provider} from 'react-redux';
import {Platform} from 'react-native';
import {AMapSdk} from 'react-native-amap3d';

import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';

import {persistor, store} from './store/store';
import MainScreen from './screens';
import {ThemeProvider} from '@rneui/themed';



const App = () => {
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
};

export default App;
