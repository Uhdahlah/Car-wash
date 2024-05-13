import {React,useEffect}from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Appearance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';


const Confirm = ({ navigation }) => {
  const colorScheme = Appearance.getColorScheme();
  const handleIconPressContinue = () => {
    navigation.navigate('Home'); // Navigate to the home screen
  };

  useEffect(() => {
    const loadFonts = async () => {
        await Font.loadAsync({
            
            'PTSerif-Bold': require('../assets/fonts/PTSerif-Bold.ttf'),

        });
    };
    loadFonts();
}, []);

  const commonStyles = {

    color: colorScheme === 'dark' ? '#fff' : '#000',
  };
  return (
    <>
    <View style={[styles.header,commonStyles]}>
      <View style={styles.icon}>
        <Ionicons name="checkmark-done-circle-outline" size={80} color="black"/>
        <Text style={styles.text}>Done</Text>
        <TouchableOpacity style={styles.button} onPress={handleIconPressContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header:{
    flex:1,
    backgroundColor:'#D8D8D8'
  },
  icon: {
    paddingTop: 250,
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#02ccfe',
    height: 50,
    width: 340,
    paddingTop: 10,
    marginTop: 100,
    borderRadius: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: 'Roboto-Bold',

    textAlign: "center",
    margin: 4,
  },
});

export default Confirm;
