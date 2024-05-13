import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Appearance } from "react-native";
import { RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Font from "expo-font";

const PromotionPage = ({ navigation }) => {
  const [promotions, setPromotions] = useState([]);
  const [activeIcon, setActiveIcon] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = Appearance.getColorScheme();
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
      });
    };

    loadFonts();
  }, []);

  useEffect(() => {
    fetch("http://backend.eastwayvisa.com/api/promotions")
      .then((response) => response.json())
      .then((data) => setPromotions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  function handlePromotionClick(service, description, promotionPrice, image) {
    // Navigate to a new page or display details
    navigation.navigate("Promotion", {
      service,
      description,
      promotionPrice,
      image,
    });
  }
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
        data={promotions}
        keyExtractor={(item) => item._id}
        numColumns={2}
        style={styles.header}
        renderItem={({ item }) => (
          <View style={styles.Promotion} key={item._id}>
            <TouchableOpacity
              onPress={() =>
                handlePromotionClick(
                  item.service,
                  item.description,
                  item.promotionPrice,
                  item.image
                )
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.promotionitem}
              />
              <View style={styles.titleContainer}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
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
  header: {
    padding: 10,
  },
  Promotion: {
    width: 180,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  promotionitem: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  titleContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
  },
  title: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Bold",
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

export default PromotionPage;
