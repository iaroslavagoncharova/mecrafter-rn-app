import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {usePost} from '../hooks/apiHooks';
import FeedPost from '../components/FeedPost';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Button, Icon, Layout, List, Text} from '@ui-kitten/components';
import {useUserContext} from '../hooks/contextHooks';

const Feed = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {postArray} = usePost();
  const {user} = useUserContext();
  const {handleAutoLogin} = useUserContext();
  useEffect(() => {
    handleAutoLogin();
  }, []);
  if (!postArray.length) {
    return <Icon name="loader-outline" style={{width: 32, height: 32}} />;
  }
  const styles = StyleSheet.create({
    button: {
      margin: 10,
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
          <Text
            style={{
              fontWeight: 'bold',
              margin: 10,
              color: 'white',
              textAlign: 'center',
            }}
          >
            Create a profile to share your thoughts with the world!
          </Text>
          <Button
            style={styles.button}
            onPress={() => {
              navigation.navigate('AuthPage');
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
