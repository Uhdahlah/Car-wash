import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Appearance } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FontAwesome } from "@expo/vector-icons";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RefreshControl } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import * as Font from "expo-font";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null); // State variable for profile picture
  const colorScheme = Appearance.getColorScheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();

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
    loadUserData();
  }, [route.params]);

  const loadUserData = async () => {
    try {
      // Replace with your logic to get the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");

      if (userId) {
        const response = await fetch(
          `http://backend.eastwayvisa.com/api/clients/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await response.json();

        // Check if there's updated user data from Editprofile page
        const updatedUser = route.params?.updatedUser;
        if (updatedUser) {
          // Merge the updated data into the user object
          setUser({ ...userData, ...updatedUser });
        } else {
          setUser(userData);
        }
      } else {
        console.error("User ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // for refreshing the field

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      // Navigate to the login screen upon logout
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const handleEditProfile = () => {
    // Navigate to the EditProfile screen when the "Edit" button is pressed
    navigation.navigate("Editprofile", { user });
  };

  // Function to handle profile picture selection from the gallery
  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4], // Optional: Set the aspect ratio (square in this case)
        quality: 1, // Optional: Image quality (0 to 1)
      });

      if (!result.canceled) {
        setProfilePic(result.uri);
      }
    } catch (error) {
      console.error("Error picking profile picture:", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <View style={[styles.container, commonStyles]}>
      <View style={styles.header}>
        <ScrollView
          Vertical={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5B7586"
              title="Refreshing..."
              titleColor="#5B7586"
            />
          }
        >
          <View style={styles.navbar}>
            <Text style={styles.headingText}>Profile</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <FontAwesomeIcon icon={faEdit} size={30} color="black" />
            </TouchableOpacity>
          </View>
          {/* Display profile picture */}
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          ) : (
            <FontAwesome
              name="user-circle"
              size={140}
              style={styles.profileImage}
            />
          )}
          {/* Add button to change profile picture */}
          <TouchableOpacity
            style={styles.changeProfilePicButton}
            onPress={pickProfilePicture}
          >
            <Text style={styles.changeProfilePicText}>
              Change Profile Picture
            </Text>
          </TouchableOpacity>
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faUser} size={30} color="black" />
              <Text
                style={styles.infoText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.clientName}
              </Text>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faPhone} size={30} color="black" />
              <Text
                style={styles.infoText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.clientPhone}
              </Text>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faEnvelope} size={30} color="black" />
              <Text
                style={styles.infoText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.clientEmail}
              </Text>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={30} color="black" />
              <Text
                style={styles.infoText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.clientAddress}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#D8D8D8",
  },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headingText: {
    fontSize: 30,
    color: "black",
    fontFamily: "Roboto-Bold",
  },
  editButton: {
    padding: 10,
  },
  editButtonText: {
    fontSize: 18,
    color: "#02ccfe",
  },
  infoCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginBottom: 20,
    borderRadius: 10,
    padding: 30,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
  },
  logoutButton: {
    backgroundColor: "#5B7586",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    borderRadius: 4,
  },
  logoutText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
  loadingText: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    marginTop: 50,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  changeProfilePicButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  changeProfilePicText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Profile;
