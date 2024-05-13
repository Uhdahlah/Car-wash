import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Appearance } from "react-native";
import { RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Font from "expo-font";

const TopservicePage = ({ navigation }) => {
  const [myFetchedData, setMyFetchedData] = useState([]);
  const [activeIcon, setActiveIcon] = useState("");
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

  useEffect(() => {
    fetch("http://backend.eastwayvisa.com/api/topservices")
      .then((response) => response.json())
      .then((data) => setMyFetchedData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  // Custom navigation function
  const navigateToScreen = (screenName) => {
    setActiveIcon(screenName);
    navigation.navigate(screenName);
  };

  function handleTopservicesClick(title, description, price, image) {
    // Navigate to a new page or display details
    navigation.navigate("Topservice", { title, description, price, image });
  }
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
        data={myFetchedData}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.topservicesItem} key={item._id}>
            <TouchableOpacity
              onPress={() =>
                handleTopservicesClick(
                  item.title,
                  item.description,
                  item.price,
                  item.image
                )
              }
            >
              {/* <Image
                source={{
                  uri:'https://i2.cdn.turner.com/money/galleries/2010/autos/1011/gallery.2010_los_angeles_auto_show/images/2012_buick_regal_gs.jpg' // Use the actual image URL from your data
                }}
                style={styles.itemImage}
                resizeMode="cover"
              /> */}
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text
                style={{ marginTop: 5, fontFamily: "Roboto-Bold" }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
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
  topservicesItem: {
    width: "47%",
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    padding: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 160, // Set a fixed width for the images
    height: 130,
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

export default TopservicePage;
