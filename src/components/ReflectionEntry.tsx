import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ReflectionWithPrompt} from '../types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import {usePrompt, useReflection} from '../hooks/apiHooks';
import {Controller, set, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import {Button, Input, Layout, List} from '@ui-kitten/components';
import useUpdateContext from '../hooks/updateHooks';

export default function ReflectionEntry(props: {
  reflections: ReflectionWithPrompt[];
}) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const {reflections} = props;
  const {update, setUpdate} = useUpdateContext();
  const user = useUserContext();
  const {postReflection} = useReflection();
  const {promptList} = usePrompt();

  const values = {
    reflection_text: '',
    prompt_id: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const addReflection = async (inputs: {reflection_text: string}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!user || !token) {
        return;
      }
      if (!selectedPrompt) {
        Alert.alert('Please select a prompt');
        return;
      }
      const result = await postReflection(
        inputs.reflection_text,
        Number(selectedPrompt),
        token
      );
      if (!result) {
        return;
      }
      Alert.alert(result.message);
      setUpdate(!update);
      reset(values);
      setSelectedPrompt(null);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const resetForm = () => {
    reset(values);
  };

  const placeholder = {
    label: 'Select a prompt',
    value: null,
  };

  const items = promptList.map((prompt) => {
    return {
      label: prompt.prompt_text,
      value: prompt.prompt_id,
      color: '#294B29',
    };
  });

  const styles = StyleSheet.create({
    pickerInput: {
      padding: 10,
      margin: 10,
      borderRadius: 8,
      backgroundColor: 'white',
    },
    layout: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#294B29',
      padding: 10,
    },
    reflectionText: {
      padding: 10,
      borderRadius: 15,
      margin: 10,
    },
    reflection: {
      padding: 10,
      margin: 10,
      backgroundColor: '#FAF8ED',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#527853',
      borderWidth: 2,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#294B29',
      textAlign: 'center',
    },
    card: {
      padding: 10,
      margin: 10,
      backgroundColor: '#FAF8ED',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#527853',
      borderWidth: 2,
    },
  });

  return (
    <View style={styles.layout}>
      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 16,
          color: 'white',
          textAlign: 'center',
        }}
      >
        Write about your day and reflect on your habits
      </Text>
      <Layout style={styles.card}>
        <RNPickerSelect
          items={items}
          placeholder={placeholder}
          value={selectedPrompt}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
            placeholder: {
              color: '#294B29',
            },
          }}
          onValueChange={(value) => {
            setSelectedPrompt(value);
          }}
        />

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Reflection text is required',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Reflection text"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.reflectionText}
              multiline={true}
              numberOfLines={4}
            />
          )}
          name="reflection_text"
          defaultValue=""
        />
        <Button
          onPress={handleSubmit(addReflection)}
          style={{marginBottom: 16, backgroundColor: '#527853'}}
        >
          Add reflection
        </Button>
      </Layout>

      {reflections.length > 0 ? (
        <View style={{flex: 1, width: '100%'}}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 8,
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            Your reflections
          </Text>
          <List
            style={{backgroundColor: '#294B29'}}
            data={reflections}
            renderItem={({item}) => (
              <Layout style={styles.reflection}>
                <Text style={styles.headerText}>{item.prompt_text}</Text>
                <Text>{item.reflection_text}</Text>
                <Text>
                  {new Date(item.created_at).toLocaleDateString()} at{' '}
                  {new Date(item.created_at).toLocaleTimeString()}
                </Text>
              </Layout>
            )}
          />
        </View>
      ) : (
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
          No reflections yet
        </Text>
      )}
    </View>
  );
}
