import {View} from 'react-native';
import React from 'react';
import {Icon, makeStyles, Text} from '@rneui/themed';

export default function AboutScreen() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Icon name="rowing" size={54} />
      <Text h4 style={styles.text}>
        智慧公路管理平台V1.0
      </Text>
      <Text style={styles.text}>By EI6705 Group9</Text>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {marginTop: 10},
}));
