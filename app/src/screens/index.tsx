import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from '@rneui/themed';

import MapScreen from './map';
import EventStackScreen from './event';
import UserStackScreen from './user';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconName;
          switch (route.name) {
            case 'Map':
              iconName = focused ? 'earth' : 'earth-outline';
              break;
            case 'EventStack':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'UserStack':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'cube-outline';
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={28}
              color={color}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        },
        tabBarStyle: {height: 55},
        tabBarLabel: ({color}) => {
          let tabName = '';
          switch (route.name) {
            case 'Map':
              tabName = '地图';
              break;
            case 'EventStack':
              tabName = '事件';
              break;
            case 'UserStack':
              tabName = '我的';
              break;
            default:
              break;
          }
          return (
            // eslint-disable-next-line react-native/no-inline-styles
            <Text style={{color: color, fontSize: 12, margin: 3}}>
              {tabName}
            </Text>
          );
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="EventStack" component={EventStackScreen} />
      <Tab.Screen name="UserStack" component={UserStackScreen} />
    </Tab.Navigator>
  );
}
