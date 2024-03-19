import React, {useEffect} from 'react';
import {useState} from 'react';
import {useUserContext} from '../hooks/contextHooks';
import {useHabit} from '../hooks/apiHooks';
import {Card, Text, Button, Layout} from '@ui-kitten/components';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useForm} from 'react-hook-form';
import useUpdateContext from '../hooks/updateHooks';

export default function HabitInfo() {
  const values = {habit_frequency: ''};
  const {postFrequency} = useHabit();
  const [editFrequency, setEditFrequency] = useState(false);
  const {user} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [selectedNumber, setSelectedNumber] = useState(1);
  const {update, setUpdate} = useUpdateContext();

  const handleNumberChange = (number: number) => {
    setSelectedNumber(number);
  };

  const addFrequency = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return;
      }
      const frequency = {
        habit_frequency: selectedNumber.toString(),
      };
      const result = await postFrequency(frequency, token);
      if (result) {
        Alert.alert(result.message);
        setUpdate(!update);
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const handleHabitChange = () => {
    Alert.alert(
      'Change habit',
      'Choosing a new habit will reset the progress for the current one. Are you sure you want to continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Continue',
          onPress: () => {
            navigation.navigate('Explore');
          },
        },
      ],
      {cancelable: false}
    );
  };

  const renderNumberPicker = () => {
    const numbers = Array.from({length: 10}, (_, index) => index + 1);

    return (
      <Picker
        selectedValue={selectedNumber}
        onValueChange={(itemValue) => handleNumberChange(itemValue)}
        style={{height: 50, width: 100, margin: 10, backgroundColor: 'white'}}
      >
        {numbers.map((number) => (
          <Picker.Item key={number} label={number.toString()} value={number} />
        ))}
      </Picker>
    );
  };

  const resetForm = () => {
    reset(values);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
      backgroundColor: '#FAF8ED',
    },
  });

  return (
    <View>
      <Layout style={styles.container}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          Current habit:{' '}
          {user && user.habit_name !== null ? user.habit_name : 'Not set'}
        </Text>
        <Button
          onPress={() => {
            handleHabitChange();
          }}
          style={{margin: 10, backgroundColor: '#50623A'}}
        >
          Pick a new one
        </Button>
      </Layout>
      <Layout style={styles.container}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          Current frequency:{' '}
          {user && user.habit_frequency !== null
            ? user.habit_frequency === 1
              ?  `${user.habit_frequency} time a week`
              : `${user.habit_frequency} times a week`
            : 'Not set'}
        </Text>
        <Button
          onPress={() => {
            setEditFrequency(!editFrequency);
          }}
          style={{margin: 10, backgroundColor: '#50623A'}}
        >
          Edit frequency
        </Button>
        {editFrequency ? (
          <Layout style={styles.container}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              New frequency:
            </Text>
            {renderNumberPicker()}
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Button
                onPress={() => {
                  addFrequency();
                  setEditFrequency(!editFrequency);
                }}
                style={{backgroundColor: '#50623A'}}
              >
                Save
              </Button>
              <Button
                style={{backgroundColor: '#CC3636'}}
                onPress={() => setEditFrequency(!editFrequency)}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </Layout>
        ) : null}
      </Layout>
    </View>
  );
}
