import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import UploadScreen from './upload';
import {EventScreen} from './event';
import EventDetailScreen from './eventDetail';

export type EventStackParams = {
  Event: {needRefetch: boolean} | undefined;
  Upload: undefined;
  EventDetail: {eventId: string; address: string};
};

const EventStack = createNativeStackNavigator<EventStackParams>();

export default function EventStackScreen() {
  return (
    <EventStack.Navigator>
      <EventStack.Screen
        name="Event"
        component={EventScreen}
        options={{headerTitle: '养护事件列表'}}
      />
      <EventStack.Screen
        name="Upload"
        component={UploadScreen}
        options={{headerTitle: '上传新养护事件'}}
      />
      <EventStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={({route}) => ({
          headerTitle: route.params.address,
        })}
      />
    </EventStack.Navigator>
  );
}
