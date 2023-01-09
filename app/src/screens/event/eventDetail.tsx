import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Chip, makeStyles} from '@rneui/themed';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {EventStackParams} from '.';
import {
  useGetEventByIdQuery,
  useGetLogByIdQuery,
} from '../../store/api/eventApi';
import {useAppSelector} from '../../store/hooks';
import {eventStatusList, eventTypeList} from '../../utils/constants';
import {buildRequestWithToken} from '../../utils/utils';

type EventDetailScreenProps = NativeStackScreenProps<
  EventStackParams,
  'EventDetail'
>;

export default function EventDetailScreen({
  navigation,
  route,
}: EventDetailScreenProps) {
  const token = useAppSelector(state => state.user.token);

  const {data: eventInfo} = useGetEventByIdQuery(
    buildRequestWithToken({path: route.params.eventId}, token),
  );

  const {data: logs} = useGetLogByIdQuery(
    buildRequestWithToken({path: route.params.eventId}, token),
  );

  const styles = useStyles();

  useEffect(() => {
    console.log(eventInfo);
    console.log(logs);
  }, [logs, eventInfo]);

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text>当前状态：</Text>
        <Chip
          title={
            eventStatusList.find(value => value.name === eventInfo?.status)
              ?.title
          }
        />
        <Text>病害类型：</Text>
        <Chip
          title={
            eventTypeList.find(value => value.name === eventInfo?.type)?.title
          }
          color="#a10e16"
        />
      </View>
      <View style={styles.logView}>
        {logs?.map(item => (
          <Text>{item.datetime}</Text>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {width: '100%', height: '100%'},
  topView: {flexDirection: 'row'},
  logView: {flexDirection: 'row'},
}));
