import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import * as Font from "expo-font";

const Editprofile = ({ route, navigation }) => {
  const { user } = route.params;
  const [editedUser, setEditedUser] = useState(user);
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),

        "PTSerif-Bold": require("../assets/fonts/PTSerif-Bold.ttf"),
      });
    };
    loadFonts();
  }, []);

  useEffect(() => {
    // Load the user ID from AsyncStorage and set it as a default value
    const loadUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setEditedUser({ ...editedUser, id: userId });
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error loading user ID:", error);
      }
    };

    loadUserId();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://backend.eastwayvisa.com/api/clients/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }

      // Handle success and navigate back to the profile screen
      navigation.navigate("Profile", { updatedUser: editedUser });
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert(
        "Error",
        "Failed to update user data. Please try again later."
      );
    }
  };

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <View style={[styles.container, , commonStyles]}>
      <Text style={styles.text}>Edit Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editedUser.clientName}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, clientName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={editedUser.clientPhone.toString()} // Convert to string
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, clientPhone: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={editedUser.clientEmail}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, clientEmail: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={editedUser.clientAddress}
        onChangeText={(text) =>
          setEditedUser({ ...editedUser, clientAddress: text })
        }
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 130,
    alignContent: "center",
    // alignItems:'center',
    // marginTop:100,
    backgroundColor: "#D8D8D8",
  },
  text: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 20,
    fontFamily: "Roboto-Bold",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#5B7586",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  saveText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
});

export default Editprofile;
