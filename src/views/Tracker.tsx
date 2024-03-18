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
import {useMessage} from '../hooks/apiHooks';
import {useUserContext} from '../hooks/contextHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';

export default function Tracker() {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [lastClickedDate, setLastClickedDate] = useState('');
  const [congratsMessage, setCongratsMessage] = useState('');
  const {messages, getMessages} = useMessage();
  const {user} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  useEffect(() => {
    getCompletedDates();
    loadLastClickedDate();
  }, []);

  const getCompletedDates = async () => {
    try {
      await AsyncStorage.removeItem('completedDates');
      await AsyncStorage.removeItem('lastClickedDate');
      const completedDates = await AsyncStorage.getItem('completedDates');
      if (completedDates !== null) {
        setCompletedDates(JSON.parse(completedDates));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadLastClickedDate = async () => {
    try {
      const lastClickedDate = await AsyncStorage.getItem('lastClickedDate');
      if (lastClickedDate !== null) {
        setLastClickedDate(lastClickedDate);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (today !== lastClickedDate) {
      setCompletedDates([...completedDates, today]);
      setLastClickedDate(today);
      try {
        await AsyncStorage.setItem(
          'completedDates',
          JSON.stringify(completedDates)
        );
        await AsyncStorage.setItem('lastClickedDate', today);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const markedDates: {[key: string]: {marked: boolean, dotColor: string, selectedDotColor: string}} = completedDates.reduce((acc: any, date) => {
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
          disabled={lastClickedDate === new Date().toISOString().split('T')[0]}
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
        <Text style={{textAlign: 'center', margin: 10, padding: 10, color: 'white'}}>
          Keep up the good work!
        </Text>
      ) : (
        <Text style={{textAlign: 'center', margin: 10, padding: 10, color: 'white'}}>
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
          As {messages ? messages.message_author : ''} once said: "
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
