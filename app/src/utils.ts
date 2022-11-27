import {PermissionsAndroid, Platform} from 'react-native';
import Config from 'react-native-config';

import {
  init,
  setNeedAddress,
  setLocatingWithReGeocode,
} from 'react-native-amap-geolocation';
import {AMapSdk} from 'react-native-amap3d';
import {BaseRequest} from './store/types/base';

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

export const initAmap = () => {
  AMapSdk.init(
    Platform.select({
      android: Config.AMAPKEY_ANDROID,
    }),
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

export const buildRequestWithToken = (request: BaseRequest, token: string) => {
  return {...request, headers: {Authorization: token}};
};
