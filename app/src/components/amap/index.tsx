import React, {useEffect} from 'react';
import {Platform} from 'react-native';

import {AMapSdk, MapView, Marker} from 'react-native-amap3d';
import Config from 'react-native-config';

export default function AMapView() {
  useEffect(() => {
    AMapSdk.init(
      Platform.select({
        android: Config.AMAPKEY_ANDROID,
      }),
    );
  }, []);
  return (
    <MapView
      initialCameraPosition={{
        target: {
          latitude: 39.91095,
          longitude: 116.37296,
        },
        zoom: 8,
      }}>
      <Marker
        position={{latitude: 39.806901, longitude: 116.297972}}
        icon={{
          uri: 'https://reactnative.dev/img/pwa/manifest-icon-512.png',
          width: 64,
          height: 64,
        }}
      />
    </MapView>
  );
}
