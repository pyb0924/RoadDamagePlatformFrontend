import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, ToastAndroid, View} from 'react-native';
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
import {
  allEventStatus,
  allEventTypes,
  eventStatusList,
  eventTypeList,
} from '../../utils/constants';
import {useGetEventsQuery} from '../../store/api/eventApi';
import {buildRequestWithToken} from '../../utils/utils';
import {EventStatus, EventType} from '../../store/types/event';
import {PermissionType} from '../../store/types/permission';

type EventScreenProps = NativeStackScreenProps<EventStackParams, 'Event'>;

export function EventScreen({navigation}: EventScreenProps) {
  const user = useAppSelector(state => state.user);

  const {theme} = useTheme();
  const styles = useStyles();

  const [isEditDialExpand, setIsEditDialExpand] = useState(false);
  const [isFilterOverlayShow, setIsFilterOverlayShow] = useState(false);

  const [eventStatusFilter, setEventStatusFilter] = useState(
    new Set(allEventStatus),
  );
  const [eventTypeFilter, setEventTypeFilter] = useState(
    new Set(allEventTypes),
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

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
    ToastAndroid.show('刷新事件列表成功', ToastAndroid.SHORT);
  }, [refetch]);

  return (
    <View style={styles.container}>
      {user.user_id === '' ||
      !user.permissions.includes(PermissionType.EVENT) ? (
        <Text style={styles.errorText}>请先登录或获取权限后再查看事件列表</Text>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              title="正在获取事件列表"
            />
          }
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
                navigation.navigate('EventDetail', {
                  eventId: item.event_id,
                  address: item.address.split('|').pop() as string,
                })
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
                      eventTypeList.find(value => value.name === item.type)
                        ?.title
                    }
                    color="#a10e16"
                  />
                </View>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
        />
      )}

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
            } else if (!user.permissions.includes(PermissionType.EVENT_ADD)) {
              ToastAndroid.show('你没有上传养护事件的权限', ToastAndroid.SHORT);
            } else {
              setIsEditDialExpand(false);
              navigation.navigate('Upload');
            }
          }}
        />
      </SpeedDial>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  errorText: {
    width: '60%',
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
  },
  eventList: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: '80%',
  },
  eventTagContainer: {flexDirection: 'row', flex: 1},
}));
