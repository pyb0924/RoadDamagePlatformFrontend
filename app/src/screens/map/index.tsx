import React, {useEffect, useState} from 'react';

import {MapView, Marker} from 'react-native-amap3d';
import {useGetAllEventsQuery} from '../../store/api/eventApi';
import {useAppSelector} from '../../store/hooks';
import {buildRequestWithToken} from '../../utils/utils';

import {makeStyles, Text} from '@rneui/themed';
import {View} from 'react-native';
import {eventStatusList, eventTypeList} from '../../utils/constants';

export default function AMapView() {
  const token = useAppSelector(state => state.user.token);
  const {data} = useGetAllEventsQuery(buildRequestWithToken({}, token));

  const [eventInfoId, setEventInfoId] = useState('');

  useEffect(() => {
    console.log(eventInfoId);
  }, [eventInfoId]);

  const styles = useStyles();
  return (
    <MapView
      style={styles.container}
      initialCameraPosition={{
        target: {
          latitude: 31.18259,
          longitude: 121.46038,
        },
        zoom: 10,
      }}
      onPress={() => {
        setEventInfoId('');
      }}>
      {data?.map(item => (
        <Marker
          key={item.event_id}
          position={{latitude: item.latitude, longitude: item.longitude}}
          onPress={() => setEventInfoId(item.event_id)}>
          {eventInfoId === item.event_id && (
            <View style={styles.infonWindow}>
              <Text>{item.address}</Text>
              <Text>
                当前状态：
                {
                  eventStatusList.find(value => value.name === item.status)
                    ?.title
                }
                {'    '}
                病害类型：
                {eventTypeList.find(value => value.name === item.type)?.title}
              </Text>
            </View>
          )}
        </Marker>
      ))}
    </MapView>
  );
}

const useStyles = makeStyles(theme => ({
  container: {width: '100%', height: '100%'},
  infonWindow: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
  },
}));
