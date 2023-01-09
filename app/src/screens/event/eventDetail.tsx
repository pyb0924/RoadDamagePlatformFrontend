import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Chip,
  Text,
  makeStyles,
  Divider,
  Button,
  Input,
  BottomSheet,
  Dialog,
  ListItem,
  Image,
  Card,
} from '@rneui/themed';
import React, {useState} from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {EventStackParams} from '.';
import {
  useEditEventMutation,
  useGetEventByIdQuery,
  useGetLogByIdQuery,
} from '../../store/api/eventApi';
import {useAppSelector} from '../../store/hooks';
import {EventStatus, Log} from '../../store/types/event';
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
  const cur_userId = useAppSelector(state => state.user.user_id);

  const {data: eventInfo, refetch: refetchEvent} = useGetEventByIdQuery(
    buildRequestWithToken({path: route.params.eventId}, token),
  );

  const {data: logs, refetch: refetchLogs} = useGetLogByIdQuery(
    buildRequestWithToken({path: route.params.eventId}, token),
  );

  const [editEvent] = useEditEventMutation();

  const styles = useStyles();

  const [notes, setNotes] = useState('');

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [deleteImageDialogVisible, setDeleteImageDialogVisible] =
    useState(false);
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [onDeleteAsset, setOnDeleteAsset] = useState<Asset>();

  const getImagePickerResponse = async (
    launchImagePicker: (arg0: CameraOptions) => Promise<ImagePickerResponse>,
  ) => {
    try {
      const result = await launchImagePicker({mediaType: 'photo'});
      if (result.assets === undefined || result.assets[0] === undefined) {
        throw new TypeError('response type error');
      }
      const curImagePickerList = assetList;
      curImagePickerList.push(result.assets[0]);
      //console.log(curImagePickerList);
      setAssetList(curImagePickerList);
    } catch (error) {
      console.log(error);
    }
  };

  const bottomSheetList = [
    {
      title: '拍摄照片',
      onPress: async () => {
        await getImagePickerResponse(launchCamera);
        setBottomSheetVisible(false);
      },
    },
    {
      title: '从相册选择',
      onPress: async () => {
        await getImagePickerResponse(launchImageLibrary);
        setBottomSheetVisible(false);
      },
    },
    {
      title: '取消',
      onPress: () => setBottomSheetVisible(false),
    },
  ];

  const onChangeNotes = (value: string) => {
    setNotes(value);
  };

  const renderLog = ({item}: ListRenderItemInfo<Log>) => (
    <View>
      <Text key={item.log_id}>{item.datetime}</Text>
    </View>
  );

  const handleOpt = () => {
    const formData = new FormData();
    formData.append('user_id', cur_userId);
    formData.append('notes', notes);

    if (eventInfo?.status === EventStatus.CONSERVING) {
      formData.append('status', EventStatus.ONCHECK);
      assetList.forEach(asset => {
        formData.append('file', {
          uri: asset.uri,
          name: asset.fileName,
          type: 'image/jpeg',
        });
      });
    } else {
      formData.append('status', EventStatus.CONSERVING);
    }
    editEvent(
      buildRequestWithToken(
        {
          path: route.params.eventId,
          body: formData,
        },
        token,
      ),
    );
    refetchEvent();
    refetchLogs();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.columnView}>
        <View style={styles.statusView}>
          <Text h4>当前状态：</Text>
          <Chip
            title={
              eventStatusList.find(value => value.name === eventInfo?.status)
                ?.title
            }
          />
          <Divider style={styles.divider} orientation="vertical" />
          <Text h4>病害类型：</Text>
          <Chip
            title={
              eventTypeList.find(value => value.name === eventInfo?.type)?.title
            }
            color="#a10e16"
          />
        </View>
        <Divider width={5} />
        {(eventInfo?.status === EventStatus.CONSERVING ||
          eventInfo?.status === EventStatus.ONCONSERVE) && (
          <Card containerStyle={styles.card}>
            <Text h4>可用操作：</Text>
            <View style={styles.columnView}>
              {eventInfo?.status === EventStatus.CONSERVING && (
                <View style={styles.imageContainer}>
                  <Text style={styles.titleItem}>上传现场图片</Text>
                  <FlatList
                    numColumns={4}
                    style={styles.imageList}
                    data={
                      assetList.length === 6
                        ? assetList
                        : assetList.concat([
                            {
                              id: 'add_blank',
                              uri: 'asset:/add_blank.jpg',
                            },
                          ])
                    }
                    renderItem={({item}) => (
                      <Image
                        source={{uri: item.uri}}
                        containerStyle={styles.imageItem}
                        PlaceholderContent={<ActivityIndicator />}
                        onPress={
                          item.id === 'add_blank'
                            ? () => {
                                setBottomSheetVisible(true);
                              }
                            : () => {}
                        }
                        onLongPress={() => {
                          setDeleteImageDialogVisible(true);
                          setOnDeleteAsset(item);
                          console.log(item);
                        }}
                      />
                    )}
                  />
                </View>
              )}
              <Input
                placeholder="备注"
                textAlignVertical="top"
                onChangeText={onChangeNotes}
              />
              <View style={styles.statusView}>
                <Button onPress={handleOpt}>
                  {eventInfo.status === EventStatus.CONSERVING
                    ? '养护完成'
                    : '开始养护'}
                </Button>
              </View>
            </View>
          </Card>
        )}
      </View>

      <View style={styles.logView}>
        <Text h4>日志流程显示</Text>
        <FlatList
          data={logs}
          renderItem={renderLog}
          keyExtractor={item => item.log_id}
        />
      </View>

      <Dialog
        isVisible={deleteImageDialogVisible}
        onBackdropPress={() => setDeleteImageDialogVisible(false)}>
        <Dialog.Title title="确认要删除这张图片吗" />
        <Dialog.Actions>
          <Dialog.Button
            title="确认"
            onPress={() => {
              if (onDeleteAsset !== undefined) {
                const index = assetList.indexOf(onDeleteAsset);
                const curAssetList = [...assetList];
                curAssetList.splice(index, 1);
                setAssetList(curAssetList);
              }
              setDeleteImageDialogVisible(false);
            }}
          />
          <Dialog.Button
            title="取消"
            onPress={() => {
              setDeleteImageDialogVisible(false);
            }}
          />
        </Dialog.Actions>
      </Dialog>

      <BottomSheet modalProps={{}} isVisible={bottomSheetVisible}>
        {bottomSheetList.map((item, index) => (
          <ListItem key={index} onPress={item.onPress}>
            <ListItem.Content style={styles.bottemSheetItem}>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {marginLeft: 5, marginRight: 5, width: '100%', height: '100%'},
  columnView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginLeft: 5,
    marginRight: 5,
  },
  statusView: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  card: {width: '90%', marginBottom: 10, marginTop: 0},
  logView: {
    backgroundColor: '#fff',
    height: '100%',
  },
  titleItem: {
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.grey3,
  },
  bottemSheetItem: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  imageContainer: {width: '100%'},
  imageList: {
    width: '100%',
    margin: '2%',
  },
  imageItem: {
    height: 100,
    marginLeft: '1%',
    marginRight: '1%',
    aspectRatio: 1,
    maxWidth: '22.5%',
    flex: 1,
  },
}));
