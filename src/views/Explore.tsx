import React, {useEffect, useState} from 'react';
import {useHabit} from '../hooks/apiHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  Text,
  List,
  Button,
  Input,
  Layout,
  Icon,
} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {useUserContext} from '../hooks/contextHooks';

export default function Explore() {
  const [filter, setFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const {habits} = useHabit();
  const {user, handleHabit} = useUserContext();
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const placeholder = {
    label: 'Select an option...',
    value: null,
  };
  const items = [
    {
      label: 'Health',
      value: 'Health',
      color: '#294B29',
      inputLabel: 'Health',
      key: 'Health',
    },
    {
      label: 'Productivity',
      value: 'Productivity',
      color: '#294B29',
      inputLabel: 'Productivity',
      key: 'Productivity',
    },
    {
      label: 'Relationships',
      value: 'Relationships',
      color: '#294B29',
      inputLabel: 'Relationships',
      key: 'Relationships',
    },
    {
      label: 'Finance',
      value: 'Finance',
      color: '#294B29',
      inputLabel: 'Finance',
      key: 'Finance',
    },
    {
      label: 'Self-care',
      value: 'Self-care',
      color: '#294B29',
      inputLabel: 'Self-care',
      key: 'Self-care',
    },
    {
      label: 'Personal',
      value: 'Personal',
      color: '#294B29',
      inputLabel: 'Personal',
      key: 'Personal',
    },
  ];
  const filteredHabits = habits.filter(
    (habit) =>
      (selectedCategory === '' || habit.habit_category === selectedCategory) &&
      (habit.habit_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        searchInput === '' ||
        habit.habit_description
          .toLowerCase()
          .includes(searchInput.toLowerCase()))
  );
  const [categorySelected, setCategorySelected] = useState(false);
  const [resetTriggered, setResetTriggered] = useState(false);
  const values = {habit_id: ''};

  const changeHabit = async (inputs: {habit_id: string}) => {
    await handleHabit(inputs);
    navigation.navigate('Profile');
  };

  const resetFilters = () => {
    setFilter('');
    setSearchInput('');
    if (categorySelected) {
      setSelectedCategory('');
      setCategorySelected(false);
      setResetTriggered(true);
    }
  };

  useEffect(() => {
    if (resetTriggered) {
      setResetTriggered(false);
    }
  }, [resetTriggered]);

  const styles = StyleSheet.create({
    layout: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#294B29',
      padding: 10,
      width: '100%',
    },
    searchInput: {
      margin: 10,
      borderRadius: 8,
      backgroundColor: 'white',
    },
    pickerInput: {
      padding: 10,
      margin: 10,
      borderRadius: 15,
      backgroundColor: 'white',
    },
    habit: {
      padding: 10,
      margin: 10,
      backgroundColor: '#FAF8ED',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#527853',
      borderWidth: 2,
      width: '95%',
    },
    text: {
      padding: 5,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    icon: {
      width: 64,
      height: 64,
      borderRadius: 50,
      marginBottom: 10,
      marginTop: 10
    },
  });

  return (
    <Layout style={styles.layout}>
      <Text
        style={{
          fontWeight: 'bold',
          margin: 10,
          color: 'white',
          textAlign: 'center',
        }}
      >
        Explore new habits to incorporate into your daily routine
      </Text>
      <Input
        placeholder="Search for a habit"
        value={searchInput}
        onChange={(e) => setSearchInput(e.nativeEvent.text)}
        style={styles.searchInput}
      />
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          setSelectedCategory(value);
          setCategorySelected(true);
        }}
        value={selectedCategory}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
          placeholder: {
            color: '#294B29',
          },
        }}
      />
      {categorySelected && <Button onPress={resetFilters}>Reset</Button>}
      {selectedCategory ? <Text>Category: {selectedCategory}</Text> : null}
      <List
        style={{backgroundColor: '#294B29'}}
        data={filteredHabits}
        renderItem={({item}) => (
          <Layout style={styles.habit}>
            <Text style={styles.headerText}>{item.habit_name}</Text>
            <Text style={styles.text}>{item.habit_description}</Text>
            <Text
              style={{
                paddingBottom: 16,
              }}
            >
              Category: {item.habit_category}
            </Text>
            {user ? (
              <Button
                onPress={() => {
                  values.habit_id = item.habit_id.toString();
                  changeHabit(values);
                }}
                style={{backgroundColor: '#527853'}}
              >
                Add
              </Button>
            ) : (
              <Text style={styles.text}>
                Log in to add this habit to your tracker
              </Text>
            )}
          </Layout>
        )}
      />
    </Layout>
  );
}
