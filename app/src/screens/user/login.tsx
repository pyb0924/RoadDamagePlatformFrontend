import React, {useState} from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Text, Button, Input, Divider, makeStyles} from '@rneui/themed';

import {useLoginMutation} from '../../store/api/loginApi';
import {useLazyGetUserByIdQuery} from '../../store/api/userApi';
import {setToken, setUser} from '../../store/slices/userSlice';
import {useAppDispatch} from '../../store/hooks';

import ErrorDialog from '../../components/dialog/error';
import {UserStackParams} from '.';

type LoginScreenProps = NativeStackScreenProps<UserStackParams, 'Login'>;

export default function LoginScreen({navigation}: LoginScreenProps) {
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserByIdQuery();
  const dispatch = useAppDispatch();

  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [userInput, setUserInput] = useState({username: '', password: ''});
  const styles = useStyles();

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
      navigation.navigate('User');
    } catch (err: any) {
      setErrorDialogMessage(err.data.message);
      setIsErrorDialogVisible(true);
      console.log(err);
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
      <ErrorDialog
        isVisible={isErrorDialogVisible}
        title="登录失败"
        message={errorDialogMessage}
      />
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textInput: {height: 40, borderColor: 'gray', borderWidth: 1},
}));
