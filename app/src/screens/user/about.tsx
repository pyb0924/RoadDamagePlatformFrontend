import {View} from 'react-native';
import React from 'react';
import {Button, Icon, makeStyles, Text} from '@rneui/themed';
import {UserStackParams} from '.';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type AboutScreenProps = NativeStackScreenProps<UserStackParams, 'About'>;
export default function AboutScreen({navigation}: AboutScreenProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Icon name="rowing" size={54} />
      <Text h4 style={styles.text}>
        智慧公路管理平台V1.0
      </Text>
      <Text style={styles.text}>By EI6705 Group9</Text>
      <Button onPress={() => navigation.goBack()} title="返回" />
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {marginTop: 10},
}));
