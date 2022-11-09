import React, {useState} from 'react';
import {View} from 'react-native';

import {Text, Button, Input, Header} from '@rneui/themed';

import {useLoginMutation} from '../store/api/loginApi';
import {useLazyGetUserByIdQuery} from '../store/api/userApi';
import {setToken, setUser} from '../store/slices/userSlice';
import {useAppDispatch} from '../store/hooks';

export default function LoginPage() {
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserByIdQuery();
  const dispatch = useAppDispatch();

  const [loginState, setloginState] = useState('未登录');
  const [userInput, setUserInput] = useState({username: '', password: ''});

  const onLoginHandler = async () => {
    console.log('login button pressed');
    try {
      const loginResponse = await login({
        body: {
          username: userInput.username,
          password: userInput.password,
        },
      }).unwrap();

      const newToken =
        loginResponse.token_type + ' ' + loginResponse.access_token;

      dispatch(setToken(newToken));

      const userResponse = await getUser({
        id: loginResponse.user_id,
        headers: {
          Authorization: newToken,
        },
      }).unwrap();
      dispatch(setUser(userResponse));
      setloginState('登陆成功');
    } catch (err: any) {
      console.log(err);
      setloginState('登陆失败');
      //console.log(err.data.message);
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
        onChangeText={text => setUserInput({...userInput, username: text})}
        placeholder="用户名"
        value={userInput.username}
      />
      <Input
        onChangeText={text => setUserInput({...userInput, password: text})}
        placeholder="密码"
        value={userInput.password}
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
