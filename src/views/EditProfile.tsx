import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/apiHooks';
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
import {Button, Card, Input, Text} from '@ui-kitten/components';
import {PutUserValues, User} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';
import {useUserContext} from '../hooks/contextHooks';
import {EditValues} from '../types/LocalTypes';

const EditProfile = ({route}: any) => {
  const user: User = route.params;
  const {putUser} = useUser();
  const {update, setUpdate} = useUpdateContext();
  const {handleEdit} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const values: Pick<User, 'username' | 'password' | 'email'> = {
    username: user.username,
    password: user.password,
    email: user.email,
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

  const edit = async (inputs: EditValues) => {
    handleEdit(inputs);
    navigation.goBack();
  }

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
              placeholder="Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="username"
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
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="email"
        />
        <Button style={styles.button} onPress={handleSubmit(edit)}>
          <Text>Save</Text>
        </Button>
      </Card>
    </TouchableOpacity>
  );
};

export default EditProfile;
