import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  useTheme
} from '@ui-kitten/components';
import {useUserContext} from '../hooks/contextHooks';
import Feed from '../views/Feed';
import Explore from '../views/Explore';
import Tracker from '../views/Tracker';
import Profile from '../views/Profile';
import EditPost from '../views/EditPost';
import CreatePost from '../views/CreatePost';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';
import AuthPage from '../views/AuthPage';
import EditProfile from '../views/EditProfile';
import Reflections from '../views/Reflections';
import EditComment from '../views/EditComment';
import WelcomeScreen from '../views/WelcomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const theme = useTheme();
  const {user} = useUserContext();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {backgroundColor: 'white', height: 55},
        tabBarLabelStyle: {color: '#294B29'},
        tabBarIcon: ({color, size, focused}) => {
          let iconName;
          focused ? (color = theme['color-primary-900']) : (color = 'gray');
          focused ? (size = 30) : (size = 25);
          if (route.name === 'Feed') {
            iconName = 'home' as 'home';
          } else if (route.name === 'Explore') {
            iconName = 'search' as 'search';
          } else if (route.name === 'Tracker') {
            iconName = 'analytics' as 'analytics';
          } else if (route.name === 'Reflections') {
            iconName = 'book' as 'book';
          } else if (route.name === 'Profile') {
            iconName = 'person' as 'person';
          } else if (route.name === 'Auth') {
            iconName = 'log-in' as 'log-in';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Explore" component={Explore} />
      {user ? (
        <>
          <Tab.Screen name="Tracker" component={Tracker} />
          <Tab.Screen name="Reflections" component={Reflections} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      ) : (
        <Tab.Screen name="Auth" component={AuthPage} />
      )}
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  const {user} = useUserContext();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="EditPost" component={EditPost} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="EditComment" component={EditComment} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
