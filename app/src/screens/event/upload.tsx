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

import {buildRequestWithToken, positionToString} from '../../utils/utils';
import {EventStackParams} from '.';
import {EventType} from '../../store/types/event';

type UploadScreenProps = NativeStackScreenProps<EventStackParams, 'Upload'>;

type UploadFormData = {
  uploadUser: string;
  eventPosition: string;
  eventAddress: string;
  notes: string;
};

//TODO fix bug: return to EventScreen
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
      eventPosition: '',
      eventAddress: '',
      notes: '',
    },
  });

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [deleteImageDialogVisible, setDeleteImageDialogVisible] =
    useState(false);
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [onDeleteAsset, setOnDeleteAsset] = useState<Asset>();

  const [addEvent] = useAddEventMutation();

  const [position, setPosition] = useState({
    latitude: 31.21,
    longitude: 121.48,
    isLocationGet: false,
    address: '地址信息未获取',
  });

  useEffect(() => {
    if (!position.isLocationGet) {
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
    console.log(formData);
    const assets = new FormData();
    assetList.forEach(asset => {
      assets.append('file', {
        uri: asset.uri,
        name: asset.fileName,
        type: 'image/jpeg',
      });
    });

    //console.log(assets);
    try {
      addEvent(
        buildRequestWithToken(
          {
            params: {
              longitude: position.longitude,
              latitude: position.latitude,
              address: formData.eventAddress,
              user_id: user.user_id,
              type: EventType.UNCATELOGUED,
              notes: formData.notes,
            },
            body: assets,
          },
          user.token,
        ),
      ).unwrap();
      navigation.navigate('Event', {needRefetch: true});
    } catch (error) {
      console.log(error);
    }
  };

  const onFail = (error: any) => {
    console.log('fail');
    console.log(error);
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

  return (
    <View style={styles.container}>
      {/*
      <MapView
        style={styles.mapView}
        initialCameraPosition={{
          target: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
          zoom: 10,
        }}>
        {position.isLocationGet && (
          <Marker
            position={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        )}
      </MapView> */}

      <Card containerStyle={styles.formView}>
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
                        console.log(coords, '\n', location);
                        setPosition({
                          latitude: coords.latitude,
                          longitude: coords.longitude,
                          isLocationGet: true,
                          address:
                            `${location.province}|${location.city}|${location.district}|` +
                            `${location.street}${location.streetNumber}(${location.description})`,
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
                      isLocationGet: false,
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

        <Controller
          control={control}
          rules={{required: false}}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={styles.multilineInput}
              label="备注"
              multiline={true}
              numberOfLines={2}
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="notes"
        />
      </Card>

      <Card containerStyle={styles.formView}>
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
      </Card>

      <Button
        icon={<Icon name="done" size={24} color="white" />}
        buttonStyle={styles.submitBotton}
        title="提交"
        titleStyle={styles.submitBottonTitle}
        onPress={handleSubmit(onSubmit, onFail)}
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
  mapView: {height: '15%', width: '100%'},
  formView: {
    backgroundColor: theme.colors.background,
    width: '90%',
    borderRadius: 10,

    paddingBottom: 0,
  },
  textItem: {
    marginLeft: 10,
    marginRight: 10,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: theme.colors.greyOutline,
  },
  titleItem: {
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.grey3,
  },
  bottemSheetItem: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  imageList: {
    width: '100%',
    margin: '2%',
    backgroundColor: theme.colors.background,
  },
  imageItem: {
    height: 100,
    marginLeft: '1%',
    marginRight: '1%',
    aspectRatio: 1,
    maxWidth: '22.5%',
    flex: 1,
  },
  submitBotton: {
    borderRadius: 5,
    width: 100,
    marginTop: 10,
  },
  submitBottonTitle: {
    fontSize: 20,
  },
}));
