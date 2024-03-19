import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useUserContext} from '../hooks/contextHooks';
import {Values} from '../types/LocalTypes';
import {useForm, Controller} from 'react-hook-form';
import {
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';

const AlertIcon = (props: any): IconElement => (
  <Icon {...props} name="alert-circle-outline" />
);

const SignIn = () => {
  const {handleLogin} = useUserContext();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const renderIcon = (props: any): IconElement => (
    <TouchableOpacity onPress={toggleShowPassword}>
      <Icon {...props} name={showPassword ? 'eye-off' : 'eye'} fill={showPassword ? 'grey' : 'green'} />
    </TouchableOpacity>
  );
  const renderCaption = () => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>
          Password must be at least 8 characters long.
        </Text>
      </View>
    );
  };
  const values: Values = {
    username: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({defaultValues: values});

  const doLogin = async (inputs: Values) => {
    handleLogin(inputs);
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
    loginButton: {
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
        Sign in if you already have an account
      </Text>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Username is required',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            style={styles.input}
          />
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Password is required',
          },
          maxLength: 20,
          minLength: 8,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={showPassword}
            style={styles.input}
            accessoryRight={renderIcon}
            caption={renderCaption}
            autoCapitalize="none"
          />
        )}
        name="password"
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(doLogin)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default SignIn;
