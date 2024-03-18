import {Alert, TouchableOpacity, Keyboard, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useComment} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Comment} from '../types/DBTypes';
import {Controller, set, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Input, Button} from '@ui-kitten/components';

export default function EditComment({route}: {route: any}) {
  const {comment} = route.params;
  const {putComment, deleteComment} = useComment();
  const {update, setUpdate} = useUpdateContext();
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const values: Pick<Comment, 'comment_text'> = {
    comment_text: comment.comment_text,
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return;
      }
      const result = await deleteComment(comment.comment_id, token);
      console.log('result', result);
      if (!result) {
        return;
      }
      Alert.alert(result.message);
      setUpdate((prevState) => !prevState);
      navigation.goBack();
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  const edit = async (inputs: Pick<Comment, 'comment_text'>) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return;
      }
      const result = await putComment(
        comment.comment_id,
        inputs.comment_text,
        token
      );
      if (!result) {
        return;
      }
      Alert.alert(result.message);
      setUpdate((prevState) => !prevState);
      resetForm();
      navigation.goBack();
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#527853',
      width: '100%',
    },
    card: {
      margin: 15,
      backgroundColor: '#DBE7C9',
      borderRadius: 15,
    },
    input: {
      padding: 10,
    },
    button: {
      margin: 10,
      backgroundColor: '#50623A',
      borderWidth: 1,
    },
    deleteButton: {
      backgroundColor: '#C70039',
    },
  });

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
      activeOpacity={1}
    >
      <Card style={styles.card}>
        <Controller
          control={control}
          rules={{
            required: {
              value: false,
              message: '',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Text"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              multiline={true}
            />
          )}
          name="comment_text"
        />
        <Button onPress={handleSubmit(edit)} style={styles.button}>
          Save
        </Button>
      </Card>
      <Card
        style={{
          backgroundColor: '#527853',
          margin: 10,
          borderWidth: 0,
        }}
      >
        <Button onPress={() => handleDelete()} style={styles.deleteButton}>
          Delete comment
        </Button>
      </Card>
    </TouchableOpacity>
  );
}
