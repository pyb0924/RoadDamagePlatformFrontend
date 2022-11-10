import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {Avatar, Text} from '@rneui/themed';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import LoginScreen from './login';
import {SafeAreaView} from 'react-native-safe-area-context';

type UserStackParams = {
  User: undefined;
  Login: undefined;
};

const UserStack = createNativeStackNavigator<UserStackParams>();

export default function UserStackScreen() {
  return (
    <UserStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <UserStack.Screen name="User" component={UserScreen} />
      <UserStack.Screen name="Login" component={LoginScreen} />
    </UserStack.Navigator>
  );
}

type UserScreenProps = NativeStackScreenProps<UserStackParams, 'User'>;

function UserScreen({navigation}: UserScreenProps) {
  return (
    <SafeAreaView>
      <ImageBackground
        source={{uri: 'https://zh-hans.reactjs.org/logo-og.png'}}
        style={styles.backgroundImage}>
        <Avatar
          size={64}
          rounded
          icon={{name: 'user', type: 'font-awesome'}}
          containerStyle={styles.avatar}
        />
        <Text h3 onPress={() => navigation.navigate('Login')}>
          登录/注册
        </Text>
      </ImageBackground>

      <View style={styles.userOption}>
        <Text>查看个人信息</Text>
        <Text>退出登录</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    aspectRatio: 1,
    flex: 1,
    flexDirection: 'column',
  },
  avatar: {backgroundColor: '#4186dd'},
  userOption: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
});
