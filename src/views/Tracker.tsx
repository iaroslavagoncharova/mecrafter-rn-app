import {
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text, Button, Card} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useHabit, useMessage} from '../hooks/apiHooks';
import {useUserContext} from '../hooks/contextHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';

export default function Tracker() {
  const [congratsMessage, setCongratsMessage] = useState('');
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const {messages, getMessages} = useMessage();
  const {user} = useUserContext();
  const {postDates, getDates} = useHabit();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const today = new Date().toISOString().split('T')[0];

  const getCompleted = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      if (user?.habit_id) {
        const result = await getDates(user?.habit_id, token);
        if (result) {
          const dates = result.map((item) => item);
          setCompletedDates(dates);
        }
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  useEffect(() => {
    getCompleted();
  }, []);

  const handleClick = async () => {
    const today = new Date().toISOString().split('T')[0];
    const token = await AsyncStorage.getItem('token');
    try {
      if (completedDates.includes(today)) {
        return;
      }
      if (!token) {
        return;
      }
      setCompletedDates([...completedDates, today]);
      if (user?.habit_id) {
        console.log('habit_id', user?.habit_id);
        const result = await postDates(user?.habit_id, today, token);
        console.log('result', result);
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const markedDates: {
    [key: string]: {
      marked: boolean;
      dotColor: string;
      selectedDotColor: string;
    };
  } = completedDates.reduce((acc: any, date) => {
    acc[date] = {
      marked: true,
      dotColor: '#50623A',
      selectedDotColor: '#50623A',
    };
    return acc;
  }, {});

  useEffect(() => {
    if (completedDates.length === user?.habit_frequency) {
      setCongratsMessage('Congratulations! You have completed your habit!');
    }
  }, [completedDates]);

  const styles = StyleSheet.create({
    card: {
      margin: 10,
      borderColor: 'black',
      backgroundColor: '#FAF8ED',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 10,
      borderRadius: 8,
    },
  });

  return (
    <ScrollView style={{backgroundColor: '#294B29'}}>
      <Calendar
        theme={{
          todayTextColor: '#CC3636',
          selectedDayBackgroundColor: '#50623A',
          arrowColor: '#50623A',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          calendarBackground: '#FAF8ED',
        }}
        markedDates={markedDates}
      />
      {user?.habit_frequency !== null ? (
        <Button
          style={{
            backgroundColor: '#50623A',
            borderWidth: 1,
            justifyContent: 'center',
            padding: 10,
            margin: 10,
          }}
          onPress={handleClick}
          disabled={completedDates.includes(today)}
        >
          <Text>Mark as completed</Text>
        </Button>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={{textAlign: 'center', margin: 10, padding: 10}}>
            Set a habit frequency to start tracking
          </Text>
        </TouchableOpacity>
      )}
      {congratsMessage === '' ? (
        <Text
          style={{textAlign: 'center', margin: 10, padding: 10, color: 'white'}}
        >
          Keep up the good work!
        </Text>
      ) : (
        <Text
          style={{textAlign: 'center', margin: 10, padding: 10, color: 'white'}}
        >
          {congratsMessage}
        </Text>
      )}
      <Text
        style={{textAlign: 'center', margin: 10, padding: 10, color: 'white'}}
      >
        {user?.habit_frequency !== null && user?.habit_frequency !== undefined
          ? 'You completed ' +
            completedDates.length +
            ' out of ' +
            user?.habit_frequency +
            ' days'
          : ''}
      </Text>
      <Card style={styles.card}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
          Your message of the day
        </Text>
        <Text style={{textAlign: 'center', margin: 10, padding: 10}}>
          As {messages ? messages.message_author : 'one good human'} once said: "
          {messages ? messages.message_text : 'No messages'}"
        </Text>
        <Button
          style={{
            backgroundColor: '#50623A',
            borderWidth: 1,
            justifyContent: 'center',
          }}
          onPress={() => {
            getMessages();
          }}
        >
          <Text>Get a new message</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
