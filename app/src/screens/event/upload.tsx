import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, useForm} from 'react-hook-form';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {Geolocation} from 'react-native-amap-geolocation';
import {MapView, Marker} from 'react-native-amap3d';

import {
  BottomSheet,
  Button,
  Card,
  Dialog,
  Icon,
  Image,
  Input,
  ListItem,
  makeStyles,
  Text,
} from '@rneui/themed';

import {useAddEventMutation} from '../../store/api/eventApi';
import {useAppSelector} from '../../store/hooks';

import {positionToString} from '../../utils';
import {EventStackParams} from '.';

type UploadScreenProps = NativeStackScreenProps<EventStackParams, 'Upload'>;

type UploadFormData = {
  uploadUser: string;
  eventName: string;
  eventPosition: string;
  eventAddress: string;
};

// TODO fix bug: return to EventScreen
export default function UploadScreen({navigation}: UploadScreenProps) {
  const user = useAppSelector(state => state.user);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      uploadUser: user.username,
      eventName: '',
      eventPosition: '',
      eventAddress: '',
    },
  });

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [deleteImageDialogVisible, setDeleteImageDialogVisible] =
    useState(false);
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [onDeleteAsset, setOnDeleteAsset] = useState<Asset>();

  const [addEvent] = useAddEventMutation();

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    address: '地址信息未获取',
  });

  useEffect(() => {
    console.log(positionToString(position));
    if (position.latitude === 0 && position.longitude === 0) {
      setValue('eventPosition', '请点击图标获取当前位置信息');
    } else {
      setValue('eventPosition', positionToString(position));
    }
    setValue('eventAddress', position.address);
  }, [setValue, position]);

  const styles = useStyles();

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

  const onSubmit = (formData: UploadFormData) => {
    uploadEvent(formData);
  };

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

  const uploadEvent = (formData: UploadFormData) => {
    const assets = new FormData();
    assetList.forEach(asset => {
      assets.append('file', {
        uri: asset.uri,
        name: asset.fileName,
        type: 'image/jpeg',
      });
    });
    console.log(assets);
    try {
      addEvent({
        params: {
          name: formData.eventName,
          longitude: position.longitude,
          latitude: position.latitude,
          address: formData.eventAddress,
          user: user.user_id,
        },
        body: assets,
        headers: {
          Authorization: user.token,
        },
      }).unwrap();
      navigation.navigate('Event');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapView}
        initialCameraPosition={{
          target: {
            latitude: 39.91095,
            longitude: 116.37296,
          },
          zoom: 8,
        }}>
        <Marker
          position={{latitude: 39.806901, longitude: 116.297972}}
          icon={{
            uri: 'https://reactnative.dev/img/pwa/manifest-icon-512.png',
            width: 64,
            height: 64,
          }}
        />
      </MapView>
      <Card containerStyle={styles.formView}>
        <View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                disabled={true}
                label="上传人"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={<Icon name="person" size={24} />}
                rightIcon={
                  <Icon
                    name="close"
                    size={24}
                    onPress={() => setValue('uploadUser', '')}
                  />
                }
              />
            )}
            name="uploadUser"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="事件名称"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                rightIcon={
                  <Icon
                    name="close"
                    size={24}
                    onPress={() => setValue('eventName', '')}
                  />
                }
              />
            )}
            name="eventName"
          />
          {errors.eventName && <Text>请输入事件名称</Text>}

          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({field: {onChange, value}}) => (
              <Input
                disabled={true}
                label="事件地点"
                onChangeText={onChange}
                value={value}
                leftIcon={
                  <Icon
                    name="location-on"
                    size={24}
                    onPress={async () => {
                      Geolocation.getCurrentPosition(
                        ({coords, location}) => {
                          setPosition({
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            address: location.address,
                          });
                        },
                        error => {
                          console.log(error);
                        },
                      );
                    }}
                  />
                }
                rightIcon={
                  <Icon
                    name="close"
                    size={24}
                    onPress={() => {
                      setPosition({
                        latitude: 0,
                        longitude: 0,
                        address: '地址信息未获取',
                      });
                    }}
                  />
                }
              />
            )}
            name="eventPosition"
          />
          {errors.eventPosition && <Text>未获取到事件位置</Text>}

          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({field: {value}}) => (
              <Text style={styles.textItem}>{value}</Text>
            )}
            name="eventAddress"
          />
        </View>

        <FlatList
          numColumns={3}
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
      </Card>
      <Button
        icon={<Icon name="done" size={18} color="white" />}
        buttonStyle={styles.submitBotton}
        size="lg"
        title="提交"
        titleStyle={styles.submitBottonTitle}
        onPress={handleSubmit(onSubmit)}
      />

      <Button
        title="返回"
        titleStyle={styles.submitBottonTitle}
        onPress={() => navigation.navigate('Event')}
      />
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
  container: {flex: 1, alignItems: 'center'},
  mapView: {height: '12%'},
  formView: {
    backgroundColor: theme.colors.background,
    width: '90%',
    borderRadius: 10,
  },
  textItem: {
    marginLeft: 10,
    marginRight: 10,
  },
  bottemSheetItem: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  imageList: {
    width: '100%',
    margin: '2%',
    backgroundColor: theme.colors.background,
  },
  imageItem: {
    margin: '1%',
    aspectRatio: 1,
    maxWidth: '30%',
    flex: 1,
  },
  submitBotton: {
    width: 100,
    marginTop: 15,
  },
  submitBottonTitle: {
    fontSize: 20,
  },
}));
