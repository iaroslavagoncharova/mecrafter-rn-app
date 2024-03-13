import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {useFile, usePost} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Values} from '../types/LocalTypes';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Video} from 'expo-av';
import {Button, Input, Card, Layout} from '@ui-kitten/components';

export default function CreatePost() {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null
  );
  const {postExpoFile} = useFile();
  const {postPost} = usePost();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const values = {
    post_title: '',
    post_text: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
    setImage(null);
  };

  const create = async (inputs: {post_title: string; post_text: string}) => {
    if (!image || !image.assets || !image.assets[0].uri) {
      Alert.alert('Please select an image');
      return;
    }
    let path = image.assets[0].uri;
    if (!image.assets[0].fileName) {
      image.assets[0].fileName = path.split('/').pop();
      console.log(image.assets[0].fileName);
    }
    image.assets[0].uri = path;
    const newUri = image.assets[0].uri;
    console.log(newUri, 'newUri', 'path', path, 'image', image);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log(newUri, 'new Uri');
        const result = await postExpoFile(newUri, token);
        console.log(result);
        const postResult = await postPost(result, inputs, token);
        Alert.alert(postResult.message);
        setUpdate(!update);
        navigation.navigate('Feed');
        resetForm();
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(result);
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
      backgroundColor: '#527853',
      justifyContent: 'center',
    },
    card: {
      justifyContent: 'center',
      margin: 15,
      backgroundColor: '#DBE7C9',
      borderRadius: 15,
    },
    image: {
      aspectRatio: 1,
      width: '90%',
      alignSelf: 'center',
      marginBottom: 10,
    },
    input: {
      margin: 10,
    },
  });

  return (
    <Layout style={styles.container}>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card style={styles.card}>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Title is required',
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
            defaultValue=""
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Text is required',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Text"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                style={styles.input}
              />
            )}
            name="post_text"
            defaultValue=""
          />
          {image && image.assets![0].mimeType?.includes('video') ? (
            <Video
              source={{uri: image.assets![0]?.uri}}
              style={{width: 200, height: 200}}
              useNativeControls
            />
          ) : (
            <TouchableOpacity onPress={chooseImage}>
              <Image
                style={styles.image}
                source={{
                  uri: image
                    ? image.assets?.[0]?.uri
                    : 'https://via.placeholder.com/150?text=Select+image',
                }}
              />
            </TouchableOpacity>
          )}
          <Button onPress={handleSubmit(create)}>Post</Button>
        </Card>
      </TouchableOpacity>
    </Layout>
  );
}
