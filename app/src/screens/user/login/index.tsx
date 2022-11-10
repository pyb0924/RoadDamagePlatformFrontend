import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Text, Button, Input, Divider} from '@rneui/themed';

import {useLoginMutation} from '../../../store/api/loginApi';
import {useLazyGetUserByIdQuery} from '../../../store/api/userApi';
import {setToken, setUser} from '../../../store/slices/userSlice';
import {useAppDispatch} from '../../../store/hooks';

export default function LoginScreen() {
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserByIdQuery();
  const dispatch = useAppDispatch();

  const [loginState, setloginState] = useState('未登录');
  const [userInput, setUserInput] = useState({username: '', password: ''});

  const onLoginHandler = async () => {
    console.log(userInput);
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
    <View style={styles.container}>
      <Text h3>智慧公路管理平台登陆</Text>
      <Divider />
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
      <Button title="登陆" onPress={onLoginHandler} />
      <Text>{loginState}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textInput: {height: 40, borderColor: 'gray', borderWidth: 1},
});
