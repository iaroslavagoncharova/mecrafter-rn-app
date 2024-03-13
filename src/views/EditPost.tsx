import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {PostWithOwner} from '../types/DBTypes';
import {usePost} from '../hooks/apiHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useEffect} from 'react';
import {Button, Card, Layout, Text, Input} from '@ui-kitten/components';
import useUpdateContext from '../hooks/updateHooks';

const EditPost = ({route}: any) => {
  const post: PostWithOwner = route.params;
  const {putPost} = usePost();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const values: Pick<PostWithOwner, 'post_title' | 'post_text'> = {
    post_title: post.post_title,
    post_text: post.post_text,
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

  const edit = async (
    inputs: Pick<PostWithOwner, 'post_title' | 'post_text'>
  ) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return;
      }
      const result = await putPost(post.post_id, inputs, token);
      Alert.alert(result.message);
      setUpdate(!update);
      navigation.navigate('Feed');
      resetForm();
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
    }
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
              placeholder="Title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="post_title"
        />
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
            />
          )}
          name="post_text"
        />
        <Button onPress={handleSubmit(edit)} style={styles.button}>
          <Text>Save</Text>
        </Button>
        <Text style={{margin: 10, textAlign: 'center'}}>
          You can update both the title and the text of your post here.
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default EditPost;
