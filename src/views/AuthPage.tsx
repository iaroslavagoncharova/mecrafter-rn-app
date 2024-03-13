import {View, Text, TouchableOpacity, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUserContext} from '../hooks/contextHooks';
import {Button, Layout} from '@ui-kitten/components';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

export default function AuthPage() {
  const [register, setRegister] = useState(false);
  const handleToggle = () => setRegister(!register);
  const {handleAutoLogin} = useUserContext();

  useEffect(() => {
    handleAutoLogin();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      activeOpacity={1}
      style={{flex: 1, justifyContent: 'center'}}
    >
      {!register ? <SignIn /> : <SignUp handleToggle={handleToggle} />}
      <Button onPress={handleToggle}>
        {register
          ? 'Already have an account? Sign in'
          : 'No account yet? Sign up'}
      </Button>
    </TouchableOpacity>
  );
}
