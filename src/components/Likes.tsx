import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PostWithOwner} from '../types/DBTypes';
import {useLike} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserContext} from '../hooks/contextHooks';
import useUpdateContext from '../hooks/updateHooks';
import {Icon} from '@ui-kitten/components';

export default function Likes({post, showComments}: {post: PostWithOwner; showComments: boolean}) {
  const {getCountByPost, getLikeByUser, deleteLike, postLike} = useLike();
  const {user} = useUserContext();
  const {update, setUpdate} = useUpdateContext();
  const [count, setCount] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const getCount = async () => {
    try {
      const result = await getCountByPost(post.post_id);
      console.log('like count', result.count);
      setCount(result.count);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const getLikesByUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      return;
    }
    try {
      const userLike = await getLikeByUser(post.post_id, token);
      setUserLiked(!!userLike);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleLike = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      return;
    }
    if (user.user_id === post.user_id) {
      Alert.alert('You cannot like your own post');
      return;
    }
    try {
      if (userLiked) {
        await deleteLike(post.post_id, token);
        setUserLiked(false);
        setCount((prev) => prev - 1);
        setUpdate(!update);
        console.log('like deleted');
      } else {
        await postLike(post.post_id, token);
        setUserLiked(true);
        setCount((prev) => prev + 1);
        setUpdate(!update);
        console.log('like posted');
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  useEffect(() => {
    getLikesByUser();
    getCount();
  }, [update]);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    button: {
      height: 32,
      width: 32,
      bottom: 12,
      margin: 5
    },
  });

  return (
    <View style={styles.container}>
      {!showComments && (
      <TouchableOpacity onPress={handleLike} style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Icon
          name={userLiked ? 'heart' : 'heart-outline'}
          fill={userLiked ? '#CC3636' : '#527853'}
          style={styles.button}
        ></Icon>
        <Text style={{left: 20, bottom: 40, marginLeft: 10}}>{count}</Text>
      </TouchableOpacity>
      )}
    </View>
  );
}
