import React, {useState} from 'react';
import {ActivityIndicator, FlatList, TextInput, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  BottomSheet,
  Button,
  Dialog,
  Image,
  ListItem,
  makeStyles,
  Text,
} from '@rneui/themed';

import {useAddEventMutation} from '../../store/api/eventApi';
import {useAppSelector} from '../../store/hooks';
import {EventType} from '../../store/types/event';

export default function UploadScreen() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      eventName: '',
      lastName: '',
    },
  });
  const user = useAppSelector(state => state.user);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [deleteImageDialogVisible, setDeleteImageDialogVisible] =
    useState(false);

  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [addEvent] = useAddEventMutation();

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

  const onSubmit = () => {
    uploadEvent();
  };

  const getImagePickerResponse = async (
    launchImagePicker: (arg0: CameraOptions) => Promise<ImagePickerResponse>,
  ) => {
    try {
      const result = await launchImagePicker({mediaType: 'photo'});
      if (result.assets === undefined) {
        throw new TypeError('response type error');
      }
      const curImagePickerList = assetList;
      curImagePickerList.push(result.assets[0]);
      console.log(curImagePickerList);
      setAssetList(curImagePickerList);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const uploadEvent = () => {
    const data = new FormData();
    assetList.forEach(asset => {
      data.append('file', {
        uri: asset.uri,
        name: asset.fileName,
        type: 'image/jpeg',
      });
    });
    console.log(data);
    try {
      addEvent({
        params: {
          type: EventType.HOLE,
          longitude: 120.0,
          latitude: 30.0,
          position: 'SJTU',
          user: user.user_id,
        },
        body: data,
        headers: {
          Authorization: user.token,
        },
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>养护事件名称</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="eventName"
      />
      {errors.eventName && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="lastName"
      />

      <FlatList
        numColumns={3}
        style={styles.imageList}
        data={assetList.concat([
          {
            id: 'add_blank',
            uri: 'asset:/add_blank.jpg',
          },
        ])}
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
              //TODO confirm dialog
              //setDeleteImageDialogVisible(true);
              const position = assetList.findIndex(
                asset => asset.id === item.id,
              );
              let curAssetList = assetList;
              curAssetList = curAssetList.splice(position, 1);
              setAssetList(curAssetList);
            }}
          />
        )}
      />

      <Button title="提交" onPress={handleSubmit(onSubmit)} />
      <Button title="选择照片" onPress={() => setBottomSheetVisible(true)} />

      <Dialog
        isVisible={deleteImageDialogVisible}
        onBackdropPress={() => setDeleteImageDialogVisible(false)}>
        <Dialog.Title title="确认要删除这张图片吗" />
        <Dialog.Actions>
          <Dialog.Button
            title="确认"
            onPress={() => {
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
  container: {backgroundColor: theme.colors.background},
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
}));
