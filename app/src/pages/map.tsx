import React from 'react';
import {Platform, View} from 'react-native';
import {AMapSdk, MapView, Marker} from 'react-native-amap3d';

AMapSdk.init(
  Platform.select({
    android: '30d83ce5860f181c6adbb621ae5a9661',
  }),
);

export default function MapPage() {
  return (
    <View>
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
      ;
    </View>
  );
}
