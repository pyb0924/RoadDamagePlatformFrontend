import React from 'react';
import {View} from 'react-native';

import {Button} from '@rneui/themed';

import AMapView from '../../components/amap';

export default function MapScreen() {
  return (
    <View>
      <Button>test Button</Button>
      <AMapView />
    </View>
  );
}
