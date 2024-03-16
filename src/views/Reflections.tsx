import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useReflection} from '../hooks/apiHooks';
import {ReflectionWithPrompt} from '../types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Layout, List} from '@ui-kitten/components';
import ReflectionEntry from '../components/ReflectionEntry';

export default function Reflections() {
  const [reflections, setReflections] = useState<ReflectionWithPrompt[]>([]);
  const {user} = useUserContext();
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
    setReflections(result);
  };

  useEffect(() => {
    fetchReflections();
  }, [user]);

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
