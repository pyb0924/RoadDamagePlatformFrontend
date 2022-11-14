import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import UploadScreen from './upload';
import {EventScreen} from './event';
import EventDetailScreen from './eventDetail';

export type EventStackParams = {
  Event: undefined;
  Upload: undefined;
  EventDetail: {eventId: string} | undefined;
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
      <EventStack.Screen name="Upload" component={UploadScreen} />
      <EventStack.Screen name="EventDetail" component={EventDetailScreen} />
    </EventStack.Navigator>
  );
}
