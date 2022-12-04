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
import {buildFilterQueryArray, buildRequestWithToken} from '../../utils/utils';

type EventScreenProps = NativeStackScreenProps<EventStackParams, 'Event'>;

export function EventScreen({navigation}: EventScreenProps) {
  const user = useAppSelector(state => state.user);

  const {theme} = useTheme();
  const styles = useStyles();

  const [isEditDialExpand, setIsEditDialExpand] = useState(false);
  const [isFilterOverlayShow, setIsFilterOverlayShow] = useState(false);

  const [eventStatusFilter, setEventStatusFilter] = useState({
    onconfirm: true,
    oncheck: true,
    onconserve: true,
    conserving: true,
    withdraw: true,
  });
  const [eventTypeFilter, setEventTypeFilter] = useState({
    hole: true,
    crack: true,
    uncatelogued: true,
  });

  const {data: eventList, refetch} = useGetEventsQuery(
    buildRequestWithToken(
      {
        params: {
          status: buildFilterQueryArray(eventStatusFilter, eventStatusList),
          type: buildFilterQueryArray(eventTypeFilter, eventTypeList),
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
          checked={eventStatusFilter.onconfirm}
          onIconPress={() => {
            setEventStatusFilter({
              ...eventStatusFilter,
              onconfirm: !eventStatusFilter.onconfirm,
            });
          }}
        />
        <CheckBox
          title={'待养护'}
          checked={eventStatusFilter.onconserve}
          onIconPress={() => {
            setEventStatusFilter({
              ...eventStatusFilter,
              onconserve: !eventStatusFilter.onconserve,
            });
          }}
        />
        <CheckBox
          title={'养护中'}
          checked={eventStatusFilter.conserving}
          onIconPress={() => {
            setEventStatusFilter({
              ...eventStatusFilter,
              conserving: !eventStatusFilter.conserving,
            });
          }}
        />
        <CheckBox
          title={'待验收'}
          checked={eventStatusFilter.oncheck}
          onIconPress={() => {
            setEventStatusFilter({
              ...eventStatusFilter,
              oncheck: !eventStatusFilter.oncheck,
            });
          }}
        />
        <CheckBox
          title={'已完成'}
          checked={eventStatusFilter.withdraw}
          onIconPress={() => {
            setEventStatusFilter({
              ...eventStatusFilter,
              withdraw: !eventStatusFilter.withdraw,
            });
          }}
        />

        <Text h4>养护类型</Text>
        <CheckBox
          title={'坑洞'}
          checked={eventTypeFilter.hole}
          onIconPress={() => {
            setEventTypeFilter({
              ...eventTypeFilter,
              hole: !eventTypeFilter.hole,
            });
          }}
        />
        <CheckBox
          title={'裂痕'}
          checked={eventTypeFilter.crack}
          onIconPress={() => {
            setEventTypeFilter({
              ...eventTypeFilter,
              crack: !eventTypeFilter.crack,
            });
          }}
        />
        <CheckBox
          title={'未分类'}
          checked={eventTypeFilter.uncatelogued}
          onIconPress={() => {
            setEventTypeFilter({
              ...eventTypeFilter,
              uncatelogued: !eventTypeFilter.uncatelogued,
            });
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
            console.log('show overlay');
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
