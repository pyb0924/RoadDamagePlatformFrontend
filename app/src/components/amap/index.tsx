import React, {useEffect, useState} from 'react';

import {Cluster, MapView, Marker} from 'react-native-amap3d';
import {useGetAllEventsQuery} from '../../store/api/eventApi';
import {useAppSelector} from '../../store/hooks';
import {buildRequestWithToken} from '../../utils/utils';

import {makeStyles} from '@rneui/themed';

interface ClusterPoint {
  position: {latitude: number; longitude: number};
  properties: {key: string};
}

export default function AMapView() {
  const token = useAppSelector(state => state.user.token);
  const {data} = useGetAllEventsQuery(buildRequestWithToken({}, token));

  const [clusterPoints, setClusterPoints] = useState<ClusterPoint[]>([]);
  useEffect(() => {
    if (data === undefined) {
      return;
    }
    const newClusterPoints: ClusterPoint[] = [];
    data.forEach(item => {
      newClusterPoints.push({
        position: {latitude: item.latitude, longitude: item.longitude},
        properties: {key: item.event_id},
      });
    });

    setClusterPoints(newClusterPoints);
  }, [data]);

  const styles = useStyles();
  return (
    <MapView
      style={styles.container}
      initialCameraPosition={{
        target: {
          latitude: 31.18259,
          longitude: 121.46038,
        },
        zoom: 8,
      }}
    />
  );
}

const useStyles = makeStyles(() => ({
  container: {width: '100%', height: '100%'},
}));
