import {Button, makeStyles, Text} from '@rneui/themed';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {TextInput, View} from 'react-native';

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
  const onSubmit = (data: any) => console.log(data);
  const styles = useStyles();

  return (
    <View>
      <Text>养护事件名称</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
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
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastName"
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const useStyles = makeStyles(() => ({
  input: {
    backgroundColor: 'white',
  },
}));
