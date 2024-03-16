import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommentWithOwner, PostWithOwner} from '../types/DBTypes';
import {useComment} from '../hooks/apiHooks';
import {useUserContext} from '../hooks/contextHooks';
import useUpdateContext from '../hooks/updateHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Icon, Input, Layout, List} from '@ui-kitten/components';

export default function Comments({
  post,
  showComments,
  setShowComments,
}: {
  post: PostWithOwner;
  showComments: boolean;
  setShowComments: (value: boolean) => void;
}) {
  const {getCommentsByPostId, getCommentCount, postComment} = useComment();
  const [comments, setComments] = useState<CommentWithOwner[]>([]);
  const {user} = useUserContext();
  const [count, setCount] = useState<number>(0);
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const values = {comment_text: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };
  const getComments = async () => {
    try {
      const comments = await getCommentsByPostId(post.post_id);
      if (!comments) {
        return;
      }
      console.log(comments);
      setComments(comments);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const getCount = async () => {
    try {
      const result = await getCommentCount(post.post_id);
      if (!result) {
        return;
      }
      setCount(result.count);
      console.log('comment count', result.count);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const addComment = async (inputs: {comment_text: string}) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      const result = await postComment(
        inputs.comment_text,
        post.post_id,
        token
      );
      setUpdate(!update);
      resetForm();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  useEffect(() => {
    getComments();
    getCount();
  }, []);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    postTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    postText: {
      fontSize: 16,
      padding: 10,
    },
    postImage: {
      width: '100%',
      height: 200,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    icon: {
      width: 32,
      height: 32,
      left: 100,
      margin: 10,
    },
    button: {
      padding: 15,
      width: 32,
      height: 32,
      margin: 10,
      marginLeft: 20,
      bottom: 12,
    },
    layout: {
      backgroundColor: 'white',
      flexDirection: 'column',
      width: '100%',
      margin: 10,
      alignItems: 'center',
      borderColor: '#527853',
      borderWidth: 2,
      borderRadius: 15,
      paddingRight: 10,
      paddingLeft: 10,
      padding: 5,
    },
    comment: {
      backgroundColor: 'white',
      flexDirection: 'column',
      width: '100%',
      margin: 10,
      alignItems: 'center',
      paddingRight: 10,
      paddingLeft: 10,
      padding: 5,
    },
  });

  return (
    <View>
      <TouchableOpacity onPress={() => setShowComments(!showComments)}>
        <Icon name="message-circle" fill="#527853" style={styles.button} />
        <Text style={{left: 50, bottom: 45, marginLeft: 5}}>
          {count ? count : 0}
        </Text>
      </TouchableOpacity>
      {showComments && user?.user_id !== post.user_id && (
        <Layout style={{backgroundColor: '#FAF8ED', width: 300}}>
          <List
            style={{backgroundColor: '#FAF8ED', width: '100%'}}
            data={comments}
            renderItem={({item}) =>
              user?.user_id === item.user_id ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EditComment', {
                      comment: item,
                      post: post,
                    })
                  }
                >
                  <Layout style={styles.layout}>
                    <Text style={{fontWeight: 'bold'}}>You</Text>
                    <Text>{item.comment_text}</Text>
                    <Text>
                      {new Date(item.created_at).toLocaleDateString('fi-FI')}
                    </Text>
                  </Layout>
                </TouchableOpacity>
              ) : (
                <Layout style={styles.layout}>
                  <Text>{item.username}</Text>
                  <Text>{item.comment_text}</Text>
                  <Text>
                    {new Date(item.created_at).toLocaleDateString('fi-FI')}
                  </Text>
                </Layout>
              )
            }
          />
          {user ? (
            <Layout style={styles.layout}>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Comment is required',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <Layout
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                      Comment
                    </Text>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Layout>
                )}
                name="comment_text"
                defaultValue=""
              />
              <Layout>
                <Icon
                  name="paper-plane"
                  style={styles.icon}
                  fill="#527853"
                  onPress={handleSubmit(addComment)}
                />
              </Layout>
            </Layout>
          ) : (
            <Text>Sign in to comment</Text>
          )}
        </Layout>
      )}
    </View>
  );
}
