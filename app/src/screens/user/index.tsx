import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './login';
import AboutScreen from './about';
import UserScreen from './user';
import UserInfoScreen from './userInfo';

export type UserStackParams = {
  User: undefined;
  Login: undefined;
  About: undefined;
  UserInfo: undefined;
};

const UserStack = createNativeStackNavigator<UserStackParams>();

export default function UserStackScreen() {
  return (
    <UserStack.Navigator>
      <UserStack.Screen
        name="User"
        component={UserScreen}
        options={{
          headerShown: false,
        }}
      />
      <UserStack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerTitle: '登陆'}}
      />
      <UserStack.Screen
        name="About"
        component={AboutScreen}
        options={{headerTitle: '关于'}}
      />
      <UserStack.Screen name="UserInfo" component={UserInfoScreen} />
    </UserStack.Navigator>
  );
}
