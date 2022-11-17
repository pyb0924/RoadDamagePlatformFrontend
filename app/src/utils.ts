import {PermissionsAndroid} from 'react-native';
import Config from 'react-native-config';

import {
  init,
  setNeedAddress,
  setLocatingWithReGeocode,
} from 'react-native-amap-geolocation';

export const positionToString = (position: {
  latitude: number;
  longitude: number;
}) => {
  return (
    `${Math.abs(position.longitude).toFixed(2)}°${
      position.longitude > 0 ? 'N' : 'S'
    }` +
    ' ' +
    `${Math.abs(position.latitude).toFixed(2)}°${
      position.latitude > 0 ? 'E' : 'W'
    }`
  );
};

export const initAmapGeolocation = async () => {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);
  if (Config.AMAPKEY_ANDROID !== undefined) {
    await init({
      android: Config.AMAPKEY_ANDROID,
      ios: '',
    });
  } else {
    throw new TypeError('Amap API key not found');
  }

  // android
  setNeedAddress(true);

  // ios
  setLocatingWithReGeocode(true);
};