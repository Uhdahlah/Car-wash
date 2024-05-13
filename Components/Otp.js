import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import * as Font from "expo-font";

const Otp = ({ route, navigation }) => {
  // Define state variables using the useState hook
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpError, setOtpError] = useState("");
  const [generatedOTP1, setGeneratedOTP1] = useState("");
  const [isRegeneratingOTP, setIsRegeneratingOTP] = useState(false); // Track if OTP is being regenerated
  const colorScheme = Appearance.getColorScheme();
  const { generatedOTP } = route.params;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),

        "PTSerif-Bold": require("../assets/fonts/PTSerif-Bold.ttf"),
      });
    };

    loadFonts();
  }, []);

  useEffect(() => {
    generateOTP();
    // checkIfLoggedIn(); // Check if the user is already logged in
  }, []);

  // Function to generate a random 4-digit OTP
  const generateOTP = () => {
    if (isRegeneratingOTP) {
      // Only generate OTP if isRegeneratingOTP is true
      const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOTP1(newOTP);
      setIsRegeneratingOTP(false); // Reset isRegeneratingOTP to false
    }
  };

  // Function to check if the user is already logged in
  // const checkIfLoggedIn = async () => {
  //   const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  //   if (isLoggedIn === 'true') {
  //     // User is already logged in, navigate to the home screen
  //     navigation.navigate('Home');
  //   }
  // };

  // Function to handle OTP verification
  // const handleVerifyOTP = async () => {
  //   const { generatedOTP } = route.params;

  //   if (enteredOTP === generatedOTP.toString() || enteredOTP === generatedOTP1.toString()) {
  //     // OTP verification successful, set the user as logged in and navigate to the home screen
  //     await AsyncStorage.setItem('isLoggedIn', 'true');
  //     navigation.navigate('Home');
  //   } else {
  //     // Show an error message for incorrect OTP
  //     setOtpError('Enter the correct OTP');
  //   }
  // };
  const handleVerifyOTP = async () => {
    const { generatedOTP } = route.params;

    if (
      enteredOTP === generatedOTP.toString() ||
      enteredOTP === generatedOTP1.toString()
    ) {
      // OTP verification successful, make an API call to get user info
      try {
        const response = await fetch(
          "http://backend.eastwayvisa.com/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clientPhone: route.params.clientPhone }),
          }
        );

        if (response.ok) {
          const userData = await response.json();
          // Set userId in AsyncStorage
          await AsyncStorage.setItem("userId", userData.userId);

          // Set the user as logged in and navigate to the home screen
          await AsyncStorage.setItem("isLoggedIn", "true");
          navigation.navigate("Home");
        } else {
          console.error("Error fetching user information:", response.status);
        }
      } catch (error) {
        console.error("Error during user info fetch:", error);
      }
    } else {
      // Show an error message for incorrect OTP
      setOtpError("Enter the correct OTP");
    }
  };

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <>
      <View style={[styles.container, commonStyles]}>
        <Text style={styles.generatedOTP}>Generated OTP: {generatedOTP}</Text>
        <Text style={styles.generatedOTP}>
          Regenerated OTP: {generatedOTP1}
        </Text>

        <Text style={styles.log}>Verify OTP</Text>

        <Text style={styles.name}>Enter OTP</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Enter OTP"
          placeholderTextColor="#000"
          keyboardType={"numeric"}
          maxLength={6}
          onChangeText={(text) => setEnteredOTP(text)}
        />
        {otpError !== "" && <Text style={styles.errorText}>{otpError}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsRegeneratingOTP(true);
            generateOTP();
          }}
        >
          <Text style={styles.service}>Resend OTP</Text>
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            paddingTop: 30,
            marginHorizontal: 20,
            fontWeight: "bold",
          }}
        >
          By signing up, you agree to GoRide's Terms of Service and Privacy
          Policy
        </Text>

        {/* <View style={styles.account}>
          <Text style={styles.text}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.login}>Log in</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#D8D8D8",
  },
  log: {
    textAlign: "center",
    fontSize: 25,
    paddingTop: 50,
    paddingBottom: 50,
  },
  name: {
    fontSize: 20,
    marginHorizontal: 30,
    paddingTop: 10,
    color: "black",
  },
  textBox: {
    borderColor: "grey",
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 2,
    padding: 10,
    marginHorizontal: 30,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#5B7586",
    height: 50,
    paddingTop: 10,
    marginHorizontal: 30,
    marginTop: 25,
    borderRadius: 4,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "PTSerif-Bold",

    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginHorizontal: 30,
  },
  service: {
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "bold",
  },
  account: {
    flexDirection: "row",
    marginTop: 200,
    marginHorizontal: 90,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
  },
  login: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
});

export default Otp;
