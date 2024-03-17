import React, {useEffect, useRef} from 'react';
import {View, Image, Text, StyleSheet, Animated} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Home');
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.slogan}>
          Inspiring you to craft a life you love, one habit at a time!
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8ED',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  slogan: {
    fontSize: 18,
    color: '#527853',
    textAlign: 'center',
    margin: 20,
  },
});

export default WelcomeScreen;
