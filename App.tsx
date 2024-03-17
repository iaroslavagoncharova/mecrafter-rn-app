import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import React from 'react';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';
import AppNavigator from './src/navigators/Navigator';
import {useFonts} from 'expo-font';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import theme from './custom-theme.json';

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
