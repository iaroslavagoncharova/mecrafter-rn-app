import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text, Button, Calendar, Card} from '@ui-kitten/components';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMessage} from '../hooks/apiHooks';

export default function Tracker() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const {messages, getMessages} = useMessage();
  console.log(messages);

  const setDate = () => {
    const currentDate = moment().toISOString().split('T')[0];
  };

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

  //   if (
  //     !lastClickedDate ||
  //     lastClickedDate.toISOString().split('T')[0] !== currentDate
  //   ) {
  //     setLastClickedDate(moment(currentDate));
  //     setIsDisabled(true);
  //     setCompletedDates((prevCompletedDates: string[]) => [
  //       ...(prevCompletedDates || []),
  //       currentDate,
  //     ]);
  //   }
  // };

  // console.log(lastClickedDate, isDisabled, completedDates, selectedDate);

  // const handleClick = () => {
  //   setDate();
  //   setIsDisabled(false);
  // };

  // const isCompleted = (date: moment.Moment) => {
  //   return completedDates?.some((completedDate) => {
  //     const formattedCompletedDate = moment(completedDate);
  //     return date.isSame(formattedCompletedDate, 'day');
  //   });
  // };

  // const renderTileContent = ({ date }: { date: moment.Moment }) => (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <Text style={{ color: isCompleted(date) ? 'green' : 'black' }}>
  //       {date.date()}
  //     </Text>
  //   </View>
  // );

  return (
    <View>
      <Button>
        <Text>Mark as completed</Text>
      </Button>
      <Calendar />
      <Card style={styles.card}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
          Your message of the day
        </Text>
        <Text style={{textAlign: 'center', margin: 10, padding: 10}}>
          As {messages ? messages.message_author : ''} once said: "
          {messages ? messages.message_text : 'No messages'}"
        </Text>
        <Button
        style={{backgroundColor: '#50623A', borderWidth: 1, justifyContent: 'center'}}
          onPress={() => {
            getMessages();
          }}
        >
          <Text>Get a new message</Text>
        </Button>
      </Card>
    </View>
  );
}
