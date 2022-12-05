import React, {useEffect, useState} from 'react';
import {FlatList, ToastAndroid, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  CheckBox,
  Chip,
  Divider,
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
import {buildRequestWithToken} from '../../utils/utils';
import {EventStatus, EventType} from '../../store/types/event';

type EventScreenProps = NativeStackScreenProps<EventStackParams, 'Event'>;

export function EventScreen({navigation}: EventScreenProps) {
  const user = useAppSelector(state => state.user);

  const {theme} = useTheme();
  const styles = useStyles();

  const [isEditDialExpand, setIsEditDialExpand] = useState(false);
  const [isFilterOverlayShow, setIsFilterOverlayShow] = useState(false);

  const [eventStatusFilter, setEventStatusFilter] = useState(
    new Set([
      EventStatus.CHECKED,
      EventStatus.ONCHECK,
      EventStatus.ONCONFIRM,
      EventStatus.ONCONSERVE,
      EventStatus.WITHDRAW,
      EventStatus.CONSERVING,
    ]),
  );
  const [eventTypeFilter, setEventTypeFilter] = useState(
    new Set([EventType.CRACK, EventType.UNCATELOGUED, EventType.HOLE]),
  );

  const [eventUserFilter, setEventUserFilter] = useState('');

  const {data: eventList, refetch} = useGetEventsQuery(
    buildRequestWithToken(
      {
        params: {
          user_id: eventUserFilter,
          status: Array.from(eventStatusFilter),
          type: Array.from(eventTypeFilter),
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
        data={
          eventStatusFilter.size === 0 || eventTypeFilter.size === 0
            ? []
            : eventList?.data.event_list
        }
        renderItem={({item}) => (
          <ListItem
            bottomDivider
            onPress={() =>
              navigation.navigate('EventDetail', {eventId: item.event_id})
            }>
            <ListItem.Content>
              <ListItem.Title>{item.address}</ListItem.Title>
              <View style={styles.eventTagContainer}>
                <Chip
                  title={
                    eventStatusList.find(value => value.name === item.status)
                      ?.title
                  }
                />
                <Divider />

                <Chip
                  title={
                    eventTypeList.find(value => value.name === item.type)?.title
                  }
                  color="#a10e16"
                />
              </View>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />

      <Overlay
        style={styles.overlay}
        isVisible={isFilterOverlayShow}
        onBackdropPress={() => {
          setIsFilterOverlayShow(false);
          setIsEditDialExpand(false);
        }}>
        <Text h4>养护状态</Text>

        <CheckBox
          title={'待确认'}
          checked={eventStatusFilter.has(EventStatus.ONCONFIRM)}
          onPress={() => {
            const curEventStatusFilter = new Set(eventStatusFilter);
            if (eventStatusFilter.has(EventStatus.ONCONFIRM)) {
              curEventStatusFilter.delete(EventStatus.ONCONFIRM);
            } else {
              curEventStatusFilter.add(EventStatus.ONCONFIRM);
            }
            setEventStatusFilter(curEventStatusFilter);
          }}
        />
        <CheckBox
          title={'待养护'}
          checked={eventStatusFilter.has(EventStatus.ONCONSERVE)}
          onPress={() => {
            const curEventStatusFilter = new Set(eventStatusFilter);
            if (eventStatusFilter.has(EventStatus.ONCONSERVE)) {
              curEventStatusFilter.delete(EventStatus.ONCONSERVE);
            } else {
              curEventStatusFilter.add(EventStatus.ONCONSERVE);
            }
            setEventStatusFilter(curEventStatusFilter);
          }}
        />
        <CheckBox
          title={'养护中'}
          checked={eventStatusFilter.has(EventStatus.CONSERVING)}
          onPress={() => {
            const curEventStatusFilter = new Set(eventStatusFilter);
            if (eventStatusFilter.has(EventStatus.CONSERVING)) {
              curEventStatusFilter.delete(EventStatus.CONSERVING);
            } else {
              curEventStatusFilter.add(EventStatus.CONSERVING);
            }
            setEventStatusFilter(curEventStatusFilter);
          }}
        />
        <CheckBox
          title={'待验收'}
          checked={eventStatusFilter.has(EventStatus.ONCHECK)}
          onPress={() => {
            const curEventStatusFilter = new Set(eventStatusFilter);
            if (eventStatusFilter.has(EventStatus.ONCHECK)) {
              curEventStatusFilter.delete(EventStatus.ONCHECK);
            } else {
              curEventStatusFilter.add(EventStatus.ONCHECK);
            }
            setEventStatusFilter(curEventStatusFilter);
          }}
        />

        <CheckBox
          title={'已验收'}
          checked={eventStatusFilter.has(EventStatus.CHECKED)}
          onPress={() => {
            const curEventStatusFilter = new Set(eventStatusFilter);
            if (eventStatusFilter.has(EventStatus.CHECKED)) {
              curEventStatusFilter.delete(EventStatus.CHECKED);
            } else {
              curEventStatusFilter.add(EventStatus.CHECKED);
            }
            setEventStatusFilter(curEventStatusFilter);
          }}
        />

        <CheckBox
          title={'已完成'}
          checked={eventStatusFilter.has(EventStatus.WITHDRAW)}
          onPress={() => {
            const curEventStatusFilter = new Set(eventStatusFilter);
            if (eventStatusFilter.has(EventStatus.WITHDRAW)) {
              curEventStatusFilter.delete(EventStatus.WITHDRAW);
            } else {
              curEventStatusFilter.add(EventStatus.WITHDRAW);
            }
            setEventStatusFilter(curEventStatusFilter);
          }}
        />

        <Text h4>养护类型</Text>
        <CheckBox
          title={'坑洞'}
          checked={eventTypeFilter.has(EventType.HOLE)}
          onPress={() => {
            const curEventTypeFilter = new Set(eventTypeFilter);
            if (eventTypeFilter.has(EventType.HOLE)) {
              curEventTypeFilter.delete(EventType.HOLE);
            } else {
              curEventTypeFilter.add(EventType.HOLE);
            }
            setEventTypeFilter(curEventTypeFilter);
          }}
        />
        <CheckBox
          title={'裂痕'}
          checked={eventTypeFilter.has(EventType.CRACK)}
          onPress={() => {
            const curEventTypeFilter = new Set(eventTypeFilter);
            if (eventTypeFilter.has(EventType.CRACK)) {
              curEventTypeFilter.delete(EventType.CRACK);
            } else {
              curEventTypeFilter.add(EventType.CRACK);
            }
            setEventTypeFilter(curEventTypeFilter);
          }}
        />
        <CheckBox
          title={'未分类'}
          checked={eventTypeFilter.has(EventType.UNCATELOGUED)}
          onPress={() => {
            const curEventTypeFilter = new Set(eventTypeFilter);
            if (eventTypeFilter.has(EventType.UNCATELOGUED)) {
              curEventTypeFilter.delete(EventType.UNCATELOGUED);
            } else {
              curEventTypeFilter.add(EventType.UNCATELOGUED);
            }
            setEventTypeFilter(curEventTypeFilter);
          }}
        />

        <Text h4>待办</Text>
        <CheckBox
          title={'只看我的'}
          checked={eventUserFilter === user.user_id}
          onPress={() => {
            if (eventUserFilter === '') {
              setEventUserFilter(user.user_id);
            } else {
              setEventUserFilter('');
            }
          }}
        />
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
            setIsFilterOverlayShow(true);
          }}
        />
        <SpeedDial.Action
          icon={{name: 'add', color: 'white', size: 24}}
          color={theme.colors.primary}
          onPress={() => {
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
  eventTagContainer: {flexDirection: 'row', flex: 1},
}));
