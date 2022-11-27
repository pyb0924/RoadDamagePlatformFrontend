import React, {useEffect, useState} from 'react';
import {FlatList, ToastAndroid, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  CheckBox,
  ListItem,
  makeStyles,
  Overlay,
  SpeedDial,
  Text,
  useTheme,
} from '@rneui/themed';

import {EventStackParams} from '.';
import {useAppSelector} from '../../store/hooks';
import {eventStatusList, eventTypeList} from '../../utils/constants';
import {useGetEventsQuery} from '../../store/api/eventApi';
import {
  buildFilterQueryArray,
  buildRequestWithToken,
  getDefaultFilter,
} from '../../utils/utils';

type EventScreenProps = NativeStackScreenProps<EventStackParams, 'Event'>;

//type DataType = {name: string; avatar_url: string; subtitle: string};
// const list: DataType[] = [
//   {
//     name: 'Amy Farha',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
//     subtitle: 'Vice President',
//   },
//   {
//     name: 'Chris Jackson',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
//     subtitle: 'Vice Chairman',
//   },
// ];

export function EventScreen({navigation}: EventScreenProps) {
  const user = useAppSelector(state => state.user);

  const {theme} = useTheme();
  const styles = useStyles();

  const [isEditDialExpand, setIsEditDialExpand] = useState(false);
  const [isFilterOverlayShow, setIsFilterOverlayShow] = useState(false);
  const [eventStatusFilter, setEventStatusFilter] = useState(
    getDefaultFilter(eventStatusList),
  );
  const [eventTypeFilter, setEventTypeFilter] = useState(
    getDefaultFilter(eventTypeList),
  );

  const {data: eventList, refetch} = useGetEventsQuery(
    buildRequestWithToken(
      {
        params: {
          status: buildFilterQueryArray(eventStatusFilter),
          type: buildFilterQueryArray(eventTypeFilter),
        },
      },
      user.token,
    ),
  );

  useEffect(() => {
    refetch();
  }, [eventStatusFilter, eventTypeFilter, refetch]);

  return (
    <View>
      <FlatList
        style={styles.eventList}
        data={eventList?.data.event_list}
        renderItem={({item}) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.address}</ListItem.Title>
              <ListItem.Subtitle>上传人：{item.user_id}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />

      <Overlay
        style={styles.overlay}
        isVisible={isFilterOverlayShow}
        onBackdropPress={() => setIsFilterOverlayShow(false)}>
        <Text h4>养护状态</Text>
        {eventStatusList.map(item => (
          <CheckBox
            key={item.key}
            title={item.title}
            checked={Reflect.get(eventStatusFilter, item.key)}
            onPress={() => {
              const curStatusFilter = eventStatusFilter;
              const curChecked = Reflect.get(eventStatusFilter, item.key);
              Reflect.set(curStatusFilter, item.key, !curChecked);
              setEventStatusFilter(curStatusFilter);
            }}
          />
        ))}

        <Text h4>养护类型</Text>
        {eventTypeList.map(item => (
          <CheckBox
            key={item.key}
            title={item.title}
            checked={Reflect.get(eventTypeFilter, item.key)}
            onPress={() => {
              const curTypeFilter = eventTypeFilter;
              const curChecked = Reflect.get(eventTypeFilter, item.key);
              Reflect.set(curTypeFilter, item.key, !curChecked);
              setEventTypeFilter(curTypeFilter);
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
  overlay: {
    width: '80%',
  },
}));
