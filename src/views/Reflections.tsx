import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useReflection} from '../hooks/apiHooks';
import {ReflectionWithPrompt} from '../types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Layout} from '@ui-kitten/components';
import ReflectionEntry from '../components/ReflectionEntry';
import useUpdateContext from '../hooks/updateHooks';

export default function Reflections() {
  const [reflections, setReflections] = useState<ReflectionWithPrompt[]>([]);
  const {user} = useUserContext();
  const {update, setUpdate} = useUpdateContext();
  const {getReflectionsByUser} = useReflection();

  const fetchReflections = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      return;
    }
    const result = await getReflectionsByUser(user.user_id, token);
    if (!result) {
      setReflections([]);
      return;
    }
    result.reverse();
    setReflections(result);
  };

  useEffect(() => {
    fetchReflections();
  }, [update]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#294B29',
      flex: 1,
    },
    text: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <Layout style={styles.container}>
      <ReflectionEntry reflections={reflections} />
    </Layout>
  );
}
