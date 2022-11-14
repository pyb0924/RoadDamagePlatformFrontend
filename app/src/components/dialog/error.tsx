import {Text} from 'react-native';
import React, {useState} from 'react';
import {Dialog} from '@rneui/themed';

type ErrorDialogProps = {
  isVisible: boolean;
  title: string;
  message?: string;
};

export default function ErrorDialog({
  isVisible,
  title,
  message,
}: ErrorDialogProps) {
  const [visible, setVisible] = useState(isVisible);
  const toggleDialog = () => {
    setVisible(!visible);
  };

  return (
    <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
      <Dialog.Title title={title} />
      <Text>{message}</Text>
      <Dialog.Actions>
        <Dialog.Button title="确认" onPress={() => toggleDialog()} />
      </Dialog.Actions>
    </Dialog>
  );
}
