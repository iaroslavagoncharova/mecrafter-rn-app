import {StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import UserInfo from '../components/UserInfo';
import HabitInfo from '../components/HabitInfo';
import {useUserContext} from '../hooks/contextHooks';
import {Button, Card, Layout} from '@ui-kitten/components';

export default function Profile() {
  const {user, handleLogout} = useUserContext();

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
