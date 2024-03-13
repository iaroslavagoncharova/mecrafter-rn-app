import {StyleSheet, View} from 'react-native';
import React from 'react';
import {usePost} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedPost from '../components/FeedPost';
import CreatePost from './CreatePost';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Button, Icon, Layout, List, Text} from '@ui-kitten/components';
import {useUserContext} from '../hooks/contextHooks';
import {SafeAreaView} from 'react-native-safe-area-context';

const Feed = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {postArray} = usePost();
  const {user} = useUserContext();
  const styles = StyleSheet.create({
    button: {
      margin: 20,
      backgroundColor: '#50623A',
      borderWidth: 1,
      justifyContent: 'center',
    },
    icon: {
      width: 64,
      height: 64,
      borderRadius: 50,
      marginBottom: 10,
    },
  });
  const plusIcon = (props: any) => <Icon {...props} name="plus" />;
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#294B29',
        padding: 10,
      }}
    >
      {user ? (
        <>
          <Button
            accessoryRight={plusIcon}
            style={styles.icon}
            onPress={() => {
              navigation.navigate('CreatePost');
            }}
          ></Button>
        </>
      ) : (
        <>
          <Text>Create a profile to share your thoughts with the world!</Text>
          <Button
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          >
            Sign in
          </Button>
        </>
      )}
      <View style={{flex: 1, width: '100%'}}>
        <List
        style={{backgroundColor: '#294B29'}}
          data={postArray}
          renderItem={({item}) => <FeedPost post={item} />}
        />
      </View>
    </Layout>
  );
};

export default Feed;
