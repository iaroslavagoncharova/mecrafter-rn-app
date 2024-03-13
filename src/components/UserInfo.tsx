import React from 'react';
import {useEffect, useState} from 'react';
import {UnauthorizedUser} from '../types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import {
  Button,
  Card,
  Text,
  Divider,
  List,
  ListItem,
  Avatar,
  Layout,
  useTheme,
} from '@ui-kitten/components';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {useUser} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function UserInfo({user}: {user: UnauthorizedUser}) {
  const [isEditing, setIsEditing] = useState(false);
  const {handleDelete} = useUserContext();
  const theme = useTheme();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {getUserById} = useUser();
  const {update, setUpdate} = useUpdateContext();

  const styles = StyleSheet.create({
    avatar: {
      padding: 10,
    },
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
      backgroundColor: '#FAF8ED',
    },
    button: {
      margin: 10,
      backgroundColor: '#50623A',
      borderWidth: 1,
      width: 100,
    },
    deleteButton: {
      margin: 10,
      backgroundColor: '#CC3636',
      borderWidth: 1,
      width: 100,
    },
  });

  return (
    <Layout style={styles.container}>
      <Layout style={styles.container}>
        <Avatar
          source={{uri: 'https://i.pravatar.cc/300'}}
          size="giant"
          style={styles.avatar}
        />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.username}</Text>
        <Text>{user.email}</Text>
        <Text>
          Joined us on {new Date(user.created_at).toLocaleDateString('fi-FI')}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Button
            style={styles.button}
            onPress={() => {
              navigation.navigate('EditProfile', user);
            }}
          >
            <Text>Edit</Text>
          </Button>
          <Button style={styles.deleteButton} onPress={() => handleDelete()}>
            <Text>Delete</Text>
          </Button>
        </View>
      </Layout>
    </Layout>
  );
}
