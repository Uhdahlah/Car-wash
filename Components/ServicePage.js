import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Appearance } from "react-native";
import { RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";

const ServicePage = ({ navigation }) => {
  const [servicesData, setServicesData] = useState([]);
  const [activeIcon, setActiveIcon] = useState("Notification");
  const colorScheme = Appearance.getColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
      });
    };

    loadFonts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const navigateToScreen = (screenName) => {
    setActiveIcon(screenName);
    navigation.navigate(screenName);
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveIcon("");
    }, [])
  );

  useEffect(() => {
    fetch("http://backend.eastwayvisa.com/api/services")
      .then((response) => response.json())
      .then((data) => setServicesData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  function handleIconPressService(
    serviceName,
    serviceDescription,
    servicePrice,
    serviceImage
  ) {
    navigation.navigate("Washing", {
      serviceName,
      serviceDescription,
      servicePrice,
      serviceImage,
    });
  }

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <View style={[styles.container, commonStyles]}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5B7586"
            title="Refreshing..."
            titleColor="#5B7586"
          />
        }
        data={servicesData}
        keyExtractor={(item) => item._id}
        numColumns={1}
        style={{ paddingTop: 15 }} // Add some padding at the top
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              onPress={() =>
                handleIconPressService(
                  item.serviceName,
                  item.serviceDescription,
                  item.servicePrice,
                  item.serviceImage
                )
              }
              style={styles.servicecard}
            >
              {/* <Image source={require('../Components/Assets/Carwash.png')} style={styles.serviceimage} /> */}
              <Image
                source={{ uri: item.serviceImage }}
                style={styles.serviceimage}
                resizeMode="contain"
              />
              <View style={styles.textContainer}>
                <Text
                  style={styles.servicetitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.serviceName}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color="black"
                  style={styles.nextIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
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
  cardContainer: {
    height: 75,
    backgroundColor: "#fff",
    padding: 18,
    elevation: 5,
    marginBottom: 1,
  },
  servicecard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceimage: {
    height: 40,
    resizeMode: "contain",
    width: 50,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicetitle: {
    flex: 1,
    fontSize: 16,
    color: "black",
    fontFamily: "Roboto-Bold",
    padding: 5,
    marginLeft: 10,
  },
  nextIcon: {
    fontSize: 20,
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

export default ServicePage;
