import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Layout,
  Text,
  Icon,
} from '@ui-kitten/components';
import React from 'react';
import AppNavigator from './src/navigators/Navigator';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';
import {StatusBar} from 'expo-status-bar';
import {default as theme} from './custom-theme.json';
import {useFonts} from 'expo-font';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

export default () => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
        <UserProvider>
          <UpdateProvider>
            <AppNavigator />
          </UpdateProvider>
        </UserProvider>
      </ApplicationProvider>
    </>
  );
};
