import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Appearance } from "react-native";
import {
  Button as PaperButton,
  Text as PaperText,
  Provider as PaperProvider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";

const Login = ({ navigation }) => {
  const [clientPhone, setclientPhone] = useState("");
  const [clientPhoneError, setclientPhoneError] = useState("");
  const [apiResponse, setApiResponse] = useState([]);
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),

        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      });
    };

    loadFonts();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchAPIResponse();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    // Check if a user ID is stored in AsyncStorage

    AsyncStorage.getItem("userId")
      .then((userId) => {
        if (userId) {
          // If the user is already registered, navigate to the Home page
          navigation.navigate("Home");
        }
      })
      .catch((error) => {
        console.error("Error checking AsyncStorage:", error);
      });
  }, [navigation]);

  // const fetchAPIResponse = async () => {
  //   try {
  //     const response = await fetch(
  //       'http://backend.eastwayvisa.com/api/clients'
  //     );
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     setApiResponse(data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const handleclientPhoneChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");

    if (numericValue.length <= 13) {
      setclientPhone(numericValue);
      setclientPhoneError("");
    }
  };

  // const handleLogin = async () => {
  //   setclientPhoneError('');

  //   if (clientPhone.length === 10) {
  //     const user = apiResponse.find(
  //       (element) => element.clientPhone === parseInt(clientPhone)
  //     );

  //     if (user) {
  //       const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  //       try {
  //         await AsyncStorage.setItem('userId', user._id);
  //       } catch (error) {
  //         console.error('Error storing user data:', error);
  //       }

  //       navigation.navigate('Otp', {
  //         clientPhone,
  //         generatedOTP,
  //       });
  //     } else {
  //       setclientPhoneError('* Phone number not found');
  //     }
  //   } else {
  //     setclientPhoneError('* Phone number should be 10 digits');
  //   }
  // };

  // const fetchAPIResponse = async (clientPhone) => {
  //   try {
  //     const response = await fetch(
  //       'http://backend.eastwayvisa.com/api/login',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ clientPhone: parseInt(clientPhone) }), // Adjust the payload format
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();

  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching login data:', error);
  //     throw error;
  //   }
  // };

  // const handleLogin = async () => {
  //   setclientPhoneError('');

  //   if (clientPhone.length === 10) {
  //     try {
  //       const loginData = await fetchAPIResponse(clientPhone);

  //       if (loginData.exists) {
  //         const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  //         try {
  //           await AsyncStorage.setItem('userId', loginData.user._id);
  //         } catch (error) {
  //           console.error('Error storing user data:', error);
  //         }

  //         navigation.navigate('Otp', {
  //           clientPhone,
  //           generatedOTP,
  //         });
  //       } else {
  //         setclientPhoneError('* Phone number not found. Please sign up.');
  //       }
  //     } catch (error) {
  //       // Handle fetchLoginAPI error
  //       setclientPhoneError('* An error occurred. Please try again.');
  //     }
  //   } else {
  //     setclientPhoneError('* Phone number should be 10 digits');
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://backend.eastwayvisa.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientPhone }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.verified) {
          // User exists, navigate to OTP page
          const generatedOTP = Math.floor(1000 + Math.random() * 9000);

          // try {
          //   await AsyncStorage.setItem('userId', data.user.userId);

          // } catch (error) {
          //   console.error('Error storing user data:', error);
          // }

          navigation.navigate("Otp", {
            clientPhone,
            generatedOTP,
          });
        } else {
          setclientPhoneError("* An error occurred. Please try again.");
        }
      } else {
        setclientPhoneError("* Phone number not found, Please Sign up.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setclientPhoneError(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    }
  };

  const handleIconPressSignup = () => {
    navigation.navigate("Signup");
  };
  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };
  return (
    <>
      <View style={[styles.container, commonStyles]}>
        <Text style={styles.log}>Log In</Text>
        <Text style={styles.name}>Phone Number</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Enter Your Phone Number"
          placeholderTextColor="#000"
          onChangeText={handleclientPhoneChange}
          value={clientPhone}
          keyboardType={"numeric"}
          maxLength={15}
        />
        {clientPhoneError !== "" && (
          <Text style={styles.errorText}>{clientPhoneError}</Text>
        )}

        <PaperButton style={styles.button} onPress={handleLogin}>
          <PaperText style={styles.buttonText}>Continue</PaperText>
        </PaperButton>

        <View style={styles.account}>
          <Text style={styles.text}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleIconPressSignup}>
            <Text style={styles.login}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sign}>By signing up, you agree to GoRide's </Text>

        <TouchableOpacity>
          <Text style={styles.service}>
            Terms of Service and Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8D8D8",
  },
  log: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginTop: 30,
    color: "black",
    textAlign: "center",
  },

  name: {
    fontSize: 18,
    paddingTop: 100,
    marginTop: 10,
    color: "black",
    marginHorizontal: 30,
    fontFamily: "Roboto-Bold",
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
    paddingTop: 5,
    marginHorizontal: 30,
    marginTop: 15,
    borderRadius: 4,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Roboto-Bold",

    textAlign: "center",
  },
  sign: {
    textAlign: "center",
    paddingTop: 100,
    fontWeight: "bold",
  },
  service: {
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginHorizontal: 30,
  },
  account: {
    flexDirection: "row",
    marginTop: 60,
    marginHorizontal: 90,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  login: {
    fontWeight: "bold",
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});

export default Login;
