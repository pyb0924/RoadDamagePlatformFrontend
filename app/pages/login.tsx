import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Text, Button, Input} from '@rneui/base';

import {useLoginMutation} from '../store/api/loginApi';
import {useAppSelector, useAppDispatch} from '../store/hook';
import {setPassword, setUsername} from '../store/slices/loginReducer';

export default function LoginView() {
  const loginBody = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  const [loginState, setloginState] = useState('未登录');

  const [login, {isLoading}] = useLoginMutation();

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
    <SafeAreaView>
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
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   textInput: {height: 40, borderColor: 'gray', borderWidth: 1},
// });
