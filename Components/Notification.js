import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Appearance } from "react-native";
import { RefreshControl } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faBell } from "@fortawesome/free-regular-svg-icons/faBell";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faUser } from "@fortawesome/free-regular-svg-icons/faUser";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Font from "expo-font";

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const colorScheme = Appearance.getColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeIcon, setActiveIcon] = useState("Notification");

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
    fetchNotifications();
    setActiveIcon("Notification");
  }, []);

  //for refreshing the field

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `http://backend.eastwayvisa.com/api/notification/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Custom navigation function
  const navigateToScreen = (screenName) => {
    setActiveIcon(screenName);
    navigation.navigate(screenName);
  };

  useFocusEffect(
    React.useCallback(() => {
      // This code will run when the screen is focused.
      setActiveIcon("Notification");
    }, [])
  );

  const handleIconPressNotification = () => {
    navigation.navigate("Notification");
  };

  const handleIconPressHome = () => {
    navigation.navigate("Home");
  };

  const handleIconPressBook = () => {
    navigation.navigate("Appointment");
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error("Error opening settings:", error);
    }
  };
  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <View style={[styles.container, commonStyles]}>
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Notification Inbox</Text>
          </View>
        </View>
      </View>
      <ScrollView
        Vertical={true}
        showsVerticalScrollIndicator={false}
        style={styles.notificationList}
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
        <View style={styles.notificationItem}>
          <FontAwesomeIcon
            icon={faBell}
            size={35}
            color="black"
            style={styles.icon}
          />
          <View style={styles.notificationText}>
            <Text style={styles.title}>{notifications.title}</Text>
            <Text>{notifications.message}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.iconsContainer1}>
          <View style={styles.text9}>
            <TouchableOpacity onPress={() => navigateToScreen("Home")}>
              <Entypo
                name="home"
                size={30}
                style={[
                  styles.icon4,
                  activeIcon === "Home"
                    ? { color: "#DAA520" }
                    : { color: "black" },
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.text10}>Home</Text>
          </View>
          <View style={styles.text9}>
            <TouchableOpacity onPress={() => navigateToScreen("Appointment")}>
              <Entypo
                name="calendar"
                size={30}
                style={[
                  styles.icon4,
                  activeIcon === "Appointment"
                    ? { color: "#DAA520" }
                    : { color: "black" },
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.text10}>Booking</Text>
          </View>
          <View style={styles.text9}>
            <TouchableOpacity onPress={() => navigateToScreen("Notification")}>
              <MaterialIcons
                name="forward-to-inbox"
                size={30}
                style={[
                  styles.icon4,
                  activeIcon === "Notification"
                    ? { color: "#DAA520" }
                    : { color: "black" },
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.text10}>Inbox</Text>
          </View>
          {/* <View style={styles.text9}>
              <TouchableOpacity onPress={() =>navigateToScreen(openSettings)}>
                <Ionicons name="settings-sharp" size={30} style={[styles.icon4, activeIcon === 'Setting' ? { color: '#DAA520' } : { color: 'black' }]}  />
              </TouchableOpacity>
              <Text style={styles.text10}>Setting</Text>
            </View> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8D8D8",
  },

  headerBackground: {
    backgroundColor: "#F2F3F4",
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  notificationList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  notificationItem: {
    height: 70,
    backgroundColor: "#F2F3F4",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
  },
  icon: {
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  footer: {
    position: "relative",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: "center",
    zIndex: 2,
    borderTopColor: "gray",
    borderWidth: 0.5,
  },
  iconsContainer1: {
    flexDirection: "row",
    alignItems: "center",
  },
  text9: {
    alignItems: "center",
  },
  text10: {
    fontSize: 10,
  },
  icon4: {
    marginHorizontal: 40,
  },
});

export default Notification;
