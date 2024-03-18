import {View, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import {Controller, useForm} from 'react-hook-form';
import {
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';

const SignUp = ({handleToggle}: {handleToggle: () => void}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {postUser, getUsernameAvailability, getEmailAvailability} = useUser();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const renderIcon = (props: any) => (
    <TouchableOpacity onPress={toggleShowPassword}>
      <Icon {...props} name={showPassword ? 'eye-off' : 'eye'} />
    </TouchableOpacity>
  );
  const renderCaption = () => {
    return (
      <View style={styles.captionContainer}>
        <Icon
          style={styles.captionIcon}
          fill="#8F9BB3"
          name="alert-circle-outline"
        />
        <Text style={styles.captionText}>
          Password must be at least 8 characters long.
        </Text>
      </View>
    );
  };
  const values = {username: '', password: '', confirmPassword: '', email: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({defaultValues: values, mode: 'onBlur'});

  const register = async (inputs: {
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
  }) => {
    try {
      delete inputs.confirmPassword;
      await postUser(inputs);
      Alert.alert('User successfully created! You can sign in now');
      handleToggle();
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  const theme = useTheme();
  const styles = StyleSheet.create({
    input: {
      marginBottom: 10,
      padding: 10,
      width: 300,
      borderRadius: 15,
      borderColor: theme['color-primary-900'],
      borderWidth: 1,
      color: theme['color-primary-900'],
    },
    captionContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    captionIcon: {
      width: 10,
      height: 10,
      marginRight: 5,
    },
    signupButton: {
      backgroundColor: theme['color-primary-500'],
      padding: 10,
      borderRadius: 25,
      width: 200,
      borderColor: 'white',
      borderWidth: 2,
      marginTop: 10,
    },
    captionText: {
      fontSize: 12,
      fontWeight: '400',
      color: '#8F9BB3',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '700',
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      padding: 10,
      paddingBottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme['color-primary-900'],
    },
    headerText: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 10,
      textAlign: 'center',
      padding: 10,
      color: 'white',
    },
  });

  return (
    <Layout style={styles.container}>
      <Text style={styles.headerText}>
        Create an account to start tracking your habits
      </Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            status="primary"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Username"
          />
        )}
        name="username"
        rules={{
          required: {
            value: true,
            message: 'Username is required',
          },
          validate: async (value) => {
            try {
              const {available} = await getUsernameAvailability(value);
              return available ? available : 'Username not available';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
      />
      <Controller
        control={control}
        name="email"
        rules={{
          required: {
            value: true,
            message: 'Email is required',
          },
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Invalid email address',
          },
          validate: async (value) => {
            try {
              const {available} = await getEmailAvailability(value);
              return available ? available : 'Email already in use';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            status="primary"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            autoCapitalize="none"
          />
        )}
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={showPassword}
            placeholder="Password"
            caption={renderCaption}
            accessoryRight={renderIcon}
            autoCapitalize="none"
          />
        )}
        name="password"
        rules={{
          required: {
            value: true,
            message: 'Password is required',
          },
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters long',
          },
          validate: (value) =>
            value === getValues('confirmPassword') || 'Passwords do not match',
        }}
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={showPassword}
            placeholder="Confirm password"
            caption={renderCaption}
            accessoryRight={renderIcon}
            autoCapitalize="none"
          />
        )}
        name="confirmPassword"
        rules={{
          required: true,
          validate: (value) => value === getValues('password'),
        }}
      />
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSubmit(register)}
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default SignUp;
