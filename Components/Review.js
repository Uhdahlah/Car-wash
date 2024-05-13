import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import * as Font from "expo-font";

const Review = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
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
    // Fetch the user's ID from AsyncStorage
    async function fetchUserId() {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Replace 'userId' with your AsyncStorage key
        if (userId !== null) {
          // Use the user's ID to fetch their name from the API
          fetch(`http://backend.eastwayvisa.com/api/clients/${userId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.clientName) {
                setName(data.clientName);
              }
            })
            .catch((error) => {
              console.error("Error fetching user name:", error);
            });
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }

    fetchUserId();
  }, []);

  const handleSubmit = () => {
    if (!message || selectedStars === 0) {
      // Display an error message and allow the user to cancel
      Alert.alert(
        "Error",
        "Review and rating are required fields.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
      return;
    }

    const reviewData = {
      clientName: name,
      message,
      rating: selectedStars,
    };

    fetch("http://backend.eastwayvisa.com/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful submission with an alert
          Alert.alert("Success", "Review submitted successfully", [
            {
              text: "OK",
              onPress: () => {
                setName("");
                setMessage("");
                setSelectedStars(0);
              },
            },
          ]);
        } else {
          // Handle errors, e.g., show an error message to the user
          console.error("Failed to submit review");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setSelectedStars(i)}
          style={{ marginRight: 10 }}
        >
          <FontAwesomeIcon
            icon={faStar}
            size={30}
            color={i <= selectedStars ? "#DAA520" : "black"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, commonStyles]}>
      <Text style={styles.label}>Message</Text>
      <TextInput
        placeholder="Write Your Review"
        placeholderTextColor="#000"
        value={message}
        multiline={true}
        numberOfLines={8}
        onChangeText={(text) => setMessage(text)}
        style={styles.input1}
      />
      <Text style={styles.label}>Rating</Text>
      <View style={{ flexDirection: "row" }}>{renderStars()}</View>
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text
          style={{ color: "#000", fontSize: 20, fontFamily: "Roboto-Bold" }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 200,
    backgroundColor: "#D8D8D8",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input1: {
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#5B7586",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 4,
  },
});

export default Review;
