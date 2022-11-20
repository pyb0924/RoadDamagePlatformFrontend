import React from 'react';
import {FlatList, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Avatar, FAB, ListItem, makeStyles} from '@rneui/themed';

import {EventStackParams} from '.';
import {useAppSelector} from '../../store/hooks';

type DataType = {name: string; avatar_url: string; subtitle: string};

type EventScreenProps = NativeStackScreenProps<EventStackParams, 'Event'>;

export function EventScreen({navigation}: EventScreenProps) {
  const user = useAppSelector(state => state.user);
  const styles = useStyles();

  const list: DataType[] = [
    {
      name: 'Amy Farha',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman',
    },
  ];

  return (
    <View>
      <FlatList
        style={styles.eventList}
        data={list}
        renderItem={({item}) => (
          <ListItem bottomDivider>
            <Avatar source={{uri: item.avatar_url}} />
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
      <FAB
        icon={{name: 'add', color: 'white'}}
        color="#4186dd"
        placement="right"
        onPress={() => {
          console.log(user);
          if (user.user_id === '' || user.token === '') {
            navigation.getParent()?.navigate('UserStack');
          } else {
            navigation.navigate('Upload');
          }
        }}
      />
    </View>
  );
}

const useStyles = makeStyles(() => ({
  eventList: {
    height: '100%',
  },
}));
