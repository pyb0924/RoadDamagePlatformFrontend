import React, {useState} from 'react';
import {View} from 'react-native';

import {useLoginMutation} from '../store/api/loginApi';
import {useAppSelector, useAppDispatch} from '../store/hook';
import {setPassword, setUsername} from '../store/slices/loginReducer';
import {Text, Button, Input, Header} from '@rneui/themed';

export default function LoginPage() {
  const loginBody = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  const [loginState, setloginState] = useState('未登录');

  const [login, {}] = useLoginMutation();

  const onLoginHandler = async () => {
    console.log('login button pressed');
    console.log(loginBody);
    try {
      const loginResponse = await login(loginBody).unwrap();
      if (loginResponse.code === 200) {
        setloginState('登陆成功');
      } else {
        setloginState('登陆失败');
      }
      console.log(loginResponse.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Header
        backgroundImageStyle={{}}
        barStyle="default"
        centerComponent={{
          text: 'MY TITLE',
          style: {color: '#fff'},
        }}
        centerContainerStyle={{}}
        containerStyle={{}}
        leftComponent={{icon: 'menu', color: '#fff'}}
        leftContainerStyle={{}}
        linearGradientProps={{}}
        placement="center"
        rightComponent={{icon: 'home', color: '#fff'}}
        rightContainerStyle={{}}
        statusBarProps={{}}
      />
      <Text>智慧公路管理平台登陆</Text>
      <Input
        onChangeText={text => dispatch(setUsername(text))}
        placeholder="用户名"
        value={loginBody.username}
      />
      <Input
        onChangeText={text => dispatch(setPassword(text))}
        placeholder="密码"
        value={loginBody.password}
        secureTextEntry={true}
      />
      <Button title="登陆" color="#f194ff" onPress={onLoginHandler} />
      <Text>{loginState}</Text>
    </View>
  );
}

// const styles = StyleSheet.create({
//   textInput: {height: 40, borderColor: 'gray', borderWidth: 1},
// });
