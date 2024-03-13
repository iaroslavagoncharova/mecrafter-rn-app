import {Text, Layout, Button, Icon} from '@ui-kitten/components';
import React, {useEffect, useReducer} from 'react';
import {Like, Post, PostWithOwner} from '../types/DBTypes';
import {useLike, useUser} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, StyleSheet, View} from 'react-native';

export default function Likes({post}: {post: PostWithOwner}) {
  type LikeState = {
    count: number;
    userLike: Like | null;
  };

  type LikeAction = {
    type: 'setLikeCount' | 'like';
    count?: number;
    like?: Like | null;
  };

  const likeInitialState: LikeState = {
    count: 0,
    userLike: null,
  };

  const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
    switch (action.type) {
      case 'setLikeCount':
        return {...state, count: action.count ?? 0};
      case 'like':
        if (action.like !== undefined) {
          return {...state, userLike: action.like};
        }
        return state;
    }
    return state;
  };

  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {getLikeByUser, getCountByPost, postLike, deleteLike} = useLike();
  const user = useUser();

  const getLikes = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      return;
    }
    try {
      const userLike = await getLikeByUser(post.post_id, token);
      if (!userLike) {
        likeDispatch({type: 'like', like: null});
        return;
      }
    } catch (e) {
      console.log('get user like error', (e as Error).message);
    }
  };

  const getCount = async () => {
    try {
      const countResponse = await getCountByPost(post.post_id);
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch (e) {
      likeDispatch({type: 'setLikeCount', count: 0});
      console.log('get user like error', (e as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getCount();
  }, [post]);

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!post || !token) {
        return;
      }

      if (likeState.userLike) {
        const result = await deleteLike(likeState.userLike.like_id, token);
        if (result) {
          likeDispatch({type: 'like', like: null});
          likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
        } else {
          console.error('Error deleting like');
        }
      } else {
        const result = await postLike(post.post_id, token);
        if (result) {
          // Fetch the updated count after posting a new like
          const updatedCount = await getCountByPost(post.post_id);
          likeDispatch({type: 'setLikeCount', count: updatedCount.count});
          // Fetch the user's like after posting a new like
          const newUserLike = await getLikeByUser(post.post_id, token);
          likeDispatch({type: 'like', like: newUserLike || null});
        } else {
          console.error('Error creating like');
        }
      }
    } catch (e) {
      Alert.alert((e as Error).message);
    }
  };

  const styles = StyleSheet.create({
    icon: {
      width: 32,
      height: 32,
    },
    text: {
      fontWeight: 'bold',
    },
  });
  return (
    <View>
      <Icon
        name="heart"
        style={styles.icon}
        onPress={handleLike}
        fill={likeState.userLike ? '#C13584' : '#000000'}
      />
      <Text>{likeState.count}</Text>
    </View>
  );
}
