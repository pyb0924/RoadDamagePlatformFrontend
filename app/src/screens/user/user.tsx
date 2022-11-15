import React from 'react';
import {FlatList, ImageBackground, SafeAreaView, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Avatar, ListItem, makeStyles, Text} from '@rneui/themed';

import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {clearUser} from '../../store/slices/userSlice';

import {UserStackParams} from '.';

type UserScreenProps = NativeStackScreenProps<UserStackParams, 'User'>;

export default function UserScreen({navigation}: UserScreenProps) {
  const unLoginOptionList = [
    {title: '登录', onPress: () => navigation.navigate('Login')},
    {title: '关于', onPress: () => navigation.navigate('About')},
  ];
  const loginOptionList = [
    {title: '查看个人信息', onPress: () => navigation.navigate('UserInfo')},
    {title: '退出登录', onPress: () => dispatch(clearUser())},
    {title: '关于', onPress: () => navigation.navigate('About')},
  ];

  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://gd-hbimg.huaban.com/b6cc7cb987c5a935ce6562986a5dc3e141a1046c3e6ca-fRGacK_fw1200',
        }}
        imageStyle={styles.backgroundImage}
        style={styles.background}>
        <View style={styles.topView}>
          <Avatar
            size={64}
            rounded
            icon={{name: 'user', type: 'font-awesome'}}
            containerStyle={styles.avatar}
          />
          <Text
            h3
            style={styles.usernameText}
            onPress={
              user.user_id ? () => null : () => navigation.navigate('Login')
            }>
            {user.user_id ? user.username : '您还未登陆'}
          </Text>
        </View>
      </ImageBackground>

      <FlatList
        style={styles.optionList}
        data={user.user_id ? loginOptionList : unLoginOptionList}
        renderItem={({item}) => (
          <ListItem bottomDivider onPress={item.onPress}>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    justifyContent: 'flex-start',
  },
  background: {
    height: '40%',
  },
  backgroundImage: {resizeMode: 'stretch', height: '100%', width: '100%'},
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{translateY: 150}],
  },
  usernameText: {
    color: 'white',
  },
  avatar: {backgroundColor: theme.colors.primary, margin: 20},
  optionList: {
    height: '100%',
  },
}));
