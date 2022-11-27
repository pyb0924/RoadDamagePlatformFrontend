import React, {useState} from 'react';
import {FlatList, ToastAndroid, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  Avatar,
  CheckBox,
  ListItem,
  makeStyles,
  Overlay,
  SpeedDial,
  useTheme,
} from '@rneui/themed';

import {EventStackParams} from '.';
import {useAppSelector} from '../../store/hooks';
import {eventStatusList} from '../../store/types/event';

type DataType = {name: string; avatar_url: string; subtitle: string};

type EventScreenProps = NativeStackScreenProps<EventStackParams, 'Event'>;

const getDefaultFilter = () => {
  const filter = {};
  eventStatusList.map(item =>
    Reflect.defineProperty(filter, item.name, {value: true}),
  );
  return filter;
};

export function EventScreen({navigation}: EventScreenProps) {
  const user = useAppSelector(state => state.user);

  const {theme} = useTheme();
  const styles = useStyles();

  const [isEditDialExpand, setIsEditDialExpand] = useState(false);
  const [isFilterOverlayShow, setIsFilterOverlayShow] = useState(false);
  const [eventFilter, seteventFilter] = useState(getDefaultFilter());

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

      <Overlay
        isVisible={isFilterOverlayShow}
        onBackdropPress={() => setIsFilterOverlayShow(false)}>
        {eventStatusList.map(item => (
          <CheckBox
            key={item.status}
            title={item.title}
            checked={Reflect.get(eventFilter, item.name)}
            onPress={() => {
              const curEventFilter = eventFilter;
              const curChecked = Reflect.get(eventFilter, item.name);
              Reflect.set(curEventFilter, item.name, !curChecked);
              seteventFilter(curEventFilter);
            }}
          />
        ))}
      </Overlay>

      <SpeedDial
        isOpen={isEditDialExpand}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setIsEditDialExpand(!isEditDialExpand)}
        onClose={() => setIsEditDialExpand(!isEditDialExpand)}
        color={theme.colors.primary}>
        <SpeedDial.Action
          icon={{name: 'filter-alt', color: 'white'}}
          color={theme.colors.primary}
          onPress={() => {
            console.log('show overlay');
            setIsFilterOverlayShow(true);
          }}
        />
        <SpeedDial.Action
          icon={{name: 'add', color: 'white', size: 24}}
          color={theme.colors.primary}
          onPress={() => {
            console.log(user);
            if (user.user_id === '' || user.token === '') {
              ToastAndroid.show('请先登录再上传', ToastAndroid.SHORT);
            } else {
              navigation.navigate('Upload');
            }
          }}
        />
      </SpeedDial>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  eventList: {
    height: '100%',
  },
}));
