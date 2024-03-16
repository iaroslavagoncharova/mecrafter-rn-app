import React, {useState} from 'react';
import {usePost} from '../hooks/apiHooks';
import {useUserContext} from '../hooks/contextHooks';
import {PostWithOwner} from '../types/DBTypes';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  Card,
  Avatar,
  ListItem,
  Button,
  Divider,
  useTheme,
  Text,
  Icon,
  Layout,
} from '@ui-kitten/components';
import {View, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUpdateContext from '../hooks/updateHooks';
import Likes from './Likes';
import Comments from './Comments';

const FeedPost = ({post}: {post: PostWithOwner}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {user} = useUserContext();
  const {deletePost} = usePost();
  const {update, setUpdate} = useUpdateContext();
  const [showComments, setShowComments] = useState<boolean>(false);

  const handleDelete = async () => {
    Alert.alert('Are you sure you want to delete this post?', '', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              return;
            }
            const result = await deletePost(post.post_id, token);
            Alert.alert(result.message);
            setUpdate(!update);
          } catch (error) {
            console.log((error as Error).message);
          }
        },
      },
    ]);
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    username: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    postTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    postContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#FAF8ED',
      width: '100%',
      borderColor: '#527853',
      borderWidth: 2,
      borderRadius: 15,
      marginBottom: 10,
    },
    postText: {
      fontSize: 16,
      padding: 10,
    },
    postImage: {
      aspectRatio: 1,
      height: 200,
      resizeMode: 'cover',
      marginBottom: 10,
      width: 100
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: '#FAF8ED',
      padding: 10,
    },
    editButton: {
      padding: 15,
      width: 32,
      marginRight: 10,
      marginLeft: 10,
    },
    deleteButton: {
      padding: 15,
      width: 32,
      marginRight: 10,
    },
    icon: {
      padding: 20,
      width: 100,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    postContent: {
      padding: 10,
      alignItems: 'center',
    },
  });

  return (
    <Card style={styles.postContainer}>
      <View style={styles.header}>
        <Avatar
          source={{uri: 'http://via.placeholder.com/150x150'}}
          size="medium"
        />
        <Text style={styles.username}>{post.username}</Text>
      </View>
      <View style={styles.postContent}>
        <Divider />
        <Text style={styles.postTitle}>{post.post_title}</Text>
        <Text style={styles.postText}>{post.post_text}</Text>
        <Image
          source={{uri: post.thumbnail}}
          style={{aspectRatio: 1, height: 200}}
        />
        <Text>{new Date(post.created_at).toLocaleDateString('fi-FI')}</Text>
      </View>
      <Divider />
      <ListItem style={styles.actions}>
        {user?.user_id === post.user_id ? (
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#FAF8ED',
            }}
          >
            <TouchableOpacity onPress={handleDelete}>
              <Icon style={styles.deleteButton} fill="#CC3636" name="trash-2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditPost', post);
              }}
            >
              <Icon style={styles.editButton} fill="#527853" name="edit" />
            </TouchableOpacity>
            <Layout style={{
              flexDirection: 'row',
              backgroundColor: '#FAF8ED',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Likes post={post} showComments={showComments} />
              <Comments post={post} showComments={showComments} setShowComments={setShowComments} />
            </Layout>
          </Layout>
        ) : (
          <>
            <TouchableOpacity>
              <Likes post={post} showComments={showComments} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Comments post={post} showComments={showComments} setShowComments={setShowComments} />
            </TouchableOpacity>
          </>
        )}
      </ListItem>
    </Card>
  );
};

export default FeedPost;
