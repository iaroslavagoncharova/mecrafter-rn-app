import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserInfo from '../components/UserInfo';
import HabitInfo from '../components/HabitInfo';
import {useUserContext} from '../hooks/contextHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button, Card, Icon, Layout, useTheme} from '@ui-kitten/components';
import useUpdateContext from '../hooks/updateHooks';
import {useUser} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const {user, handleLogout} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const theme = useTheme();
  const [contextUpdated, setContextUpdated] = useState(false);

  useEffect(() => {
    setContextUpdated((prevState) => !prevState);
  }, [user]);

  const styles = StyleSheet.create({
    layout: {
      backgroundColor: '#294B29',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    signOutButton: {
      backgroundColor: '#527853',
    },
    card: {
      margin: 10,
      backgroundColor: '#FAF8ED',
      borderRadius: 15,
      padding: 10,
      width: '90%',
    },
  });
  return (
    <ScrollView>
      {user && (
        <Layout style={styles.layout}>
          <Card style={styles.card}>
            <UserInfo user={user} />
            <Button onPress={handleLogout} style={styles.signOutButton}>
              Sign out
            </Button>
          </Card>
          <Card style={styles.card}>
            <HabitInfo />
          </Card>
        </Layout>
      )}
    </ScrollView>
  );
}
