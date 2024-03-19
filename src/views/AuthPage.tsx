import {TouchableOpacity, Keyboard} from 'react-native';
import React, {useState} from 'react';
import {Button} from '@ui-kitten/components';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

export default function AuthPage() {
  const [register, setRegister] = useState(false);
  const handleToggle = () => setRegister(!register);

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
