import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useComment} from '../hooks/apiHooks';
import {Comment, Post} from '../types/DBTypes';
import {Icon, Input, Layout, List} from '@ui-kitten/components';
import useUpdateContext from '../hooks/updateHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {useUserContext} from '../hooks/contextHooks';

type CommentWithOwner = Comment & {username: string};

export default function Comments({post}: {post: Post}) {
  const {getCommentsByPostId, getCommentCount, postComment} = useComment();
  const [comments, setComments] = useState<CommentWithOwner[]>([]);
  const {user} = useUserContext();
  const [count, setCount] = useState<number>(0);
  const {update, setUpdate} = useUpdateContext();
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
      console.log(comments);
      if (!comments) {
        return;
      }
      setComments(comments);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  useEffect(() => {
    getComments();
  }, [update]);

  const getCount = async () => {
    try {
      const result = await getCommentCount(post.post_id);
      console.log(result);
      if (!result) {
        return;
      }
      setCount(result.count);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const addComment = async (inputs: {comment_text: string}) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    console.log(inputs);
    try {
      const result = await postComment(
        inputs.comment_text,
        post.post_id,
        token
      );
      console.log(result);
      setUpdate(!update);
      resetForm();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  console.log(comments);

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
    },
  });
  return (
    <View>
      <Icon name="message-circle" style={styles.icon} />
      <Text>{count ? count : 0}</Text>
      <List
        data={comments}
        renderItem={({item}) => (
          <View style={styles.header}>
            <Text>{user && user.user_id === item.user_id ? 'You' : item.username}</Text>
            <Text>{item.comment_text}</Text>
          </View>
        )}
      />
      {user ? (
        user.user_id === post.user_id ? null : (
          <Layout>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Comment is required',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Layout>
                  <Text>Comment</Text>
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
                onPress={handleSubmit(addComment)}
              />
            </Layout>
          </Layout>
        )
      ) : (
        <Text>Log in to comment</Text>
      )}
    </View>
  );
}
