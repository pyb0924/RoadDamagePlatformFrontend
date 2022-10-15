import {View, Text, StyleSheet, Button} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native';
import {usePostLoginQuery} from '../store/api/loginApi';
import {useAppSelector, useAppDispatch} from '../store/hook';
import {setPassword, setUsername} from '../store/reducer/loginReducer';

export default function Login() {
  const loginBody = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  const {data: post, isFetching, isLoading} = usePostLoginQuery(loginBody);

  const onLoginHandler = () => {};

  return (
    <View>
      <Text>智慧公路管理平台登陆</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={text => dispatch(setUsername(text))}
        value={loginBody.username}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={text => dispatch(setPassword(text))}
        value={loginBody.password}
      />
      <Button title="登陆" color="#f194ff" onPress={() => onLoginHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {height: 40, borderColor: 'gray', borderWidth: 1},
});
