// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Appearance } from 'react-native';

const SplashScreen = ({ navigation }) => {
  // Add any necessary initialization logic here
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    // Wait for 10 seconds (10000 milliseconds) and then navigate to the Home screen
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  const commonStyles = {

    color: colorScheme === 'dark' ? '#fff' : '#000',
  };


  return (
    <View style={[styles.container,commonStyles]}>
      <Image
        source={require('../Components/Images/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8D8D8', 
  },
  logo: {
    width: 200, 
    height: 200, 
    borderRadius:100
  },
});
export default SplashScreen;