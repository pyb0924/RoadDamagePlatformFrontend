import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text} from 'react-native';
import {EventStackParams} from '.';

type EventDetailScreenProps = NativeStackScreenProps<
  EventStackParams,
  'EventDetail'
>;

export default function EventDetailScreen({
  navigation,
  router,
}: EventDetailScreenProps) {
  return (
    <View>
      <Text>EventDetailScreen</Text>
    </View>
  );
}
