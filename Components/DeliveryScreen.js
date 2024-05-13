import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { selectRestaurant } from "../features/restaurantSlice";

import * as Progress from "react-native-progress";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { XMarkIcon } from "react-native-heroicons/solid";
import { MaterialIcons } from "react-native-vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import axios from "axios";
import { Appearance } from "react-native";
import { RefreshControl } from "react-native";

export default function DeliveryScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // Use useRoute to access route parameters
  const [refreshing, setRefreshing] = useState(false);

  const locationId = route.params.locationId;
  const agentId = route.params.agentId;

  //   const restaurant = useSelector(selectRestaurant);
  const [agent, setAgent] = useState({});
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(true);
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    axios
      .get(`http://backend.eastwayvisa.com/api/agents/${agentId}`)
      .then((res) => {
        setAgent(res.data);
      })
      .catch((e) => {
        console.error("Error", e);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://backend.eastwayvisa.com/api/agentlocation/${locationId}`)
      .then((response) => {
        const data = response.data;
        // Handle the case where latitude or longitude is missing

        if (
          !data.location ||
          !data.location.latitude ||
          !data.location.longitude
        ) {
          Alert.alert(
            "Error",
            "Latitude or Longitude is missing in the response"
          );
          setLoading(false);
          return;
        }
        const { latitude, longitude } = data.location;

        setLocationData({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        Alert.alert(
          "Error",
          "Error fetching location data. Please try again later."
        );
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00CCBB" />
      </View>
    );
  }
  // Function to handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    axios
      .get(`http://backend.eastwayvisa.com/api/agentlocation/${locationId}`)
      .then((response) => {
        const data = response.data;
        const { latitude, longitude } = data.location;

        setLocationData({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        setRefreshing(false);
      });
  };

  const handleCall = () => {
    const phoneNumber = agent.contactNumber;
    Linking.openURL(`tel:+91${phoneNumber}`);
  };
  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#00CCBB", ...commonStyles }}>
        <SafeAreaView style={{ zIndex: 50 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Appointment")}
            >
              <XMarkIcon color="white" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onRefresh}>
              <MaterialIcons name="refresh" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Order Help
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              margin: 5,
              borderRadius: 10,
              padding: 10,
              zIndex: 50,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ fontSize: 16, color: "gray" }}>
                  Estimated Arrival
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                  45-55 Minutes
                </Text>
              </View>
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/animation/2022/11/10/13/26/13-26-03-556_512.gif",
                }}
                style={{ width: 100, height: 80 }}
              />
            </View>
            <Progress.Bar
              progress={0.7}
              width={200}
              color="grey"
              indeterminate={true}
            />
            <Text style={{ marginTop: 10, color: "gray" }}>
              Your car is with {agent.fullName}, he is on the way, his contact
              number {agent.contactNumber}
            </Text>
          </View>
        </SafeAreaView>
        {Platform.OS === "android" ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            style={{ flex: 1, marginTop: -10, zIndex: 0 }}
            mapType="mutedStandard"
          >
            <Marker
              coordinate={{
                latitude: locationData.latitude,
                longitude: locationData.longitude,
              }}
              identifier="origin"
              pinColor="#00CCBB"
            />
          </MapView>
        ) : (
          <MapView
            initialRegion={{
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            style={{ flex: 1, marginTop: -10, zIndex: 0 }}
            mapType="mutedStandard"
          >
            <Marker
              coordinate={{
                latitude: locationData.latitude,
                longitude: locationData.longitude,
              }}
              identifier="origin"
              pinColor="#00CCBB"
            />
          </MapView>
        )}
        <SafeAreaView
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 80,
          }}
        >
          <Image
            source={{
              uri: "https://media.licdn.com/dms/image/C5603AQH1rpWCbawQiA/profile-displayphoto-shrink_800_800/0/1662914771856?e=1687996800&v=beta&t=Xo6UuBmZQw6eSuwDuJS8IMyc_dYip4-QW4T--5k2AtE",
            }}
            style={{
              width: 48,
              height: 48,
              backgroundColor: "gray",
              borderRadius: 24,
              marginLeft: 10,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, marginLeft: 10 }}>
              {agent.fullName}
            </Text>
            <Text style={{ color: "gray" }}> Your Rider</Text>
          </View>
          <TouchableOpacity onPress={handleCall}>
            <Text
              style={{
                color: "#00CCBB",
                fontSize: 16,
                marginRight: 10,
                fontWeight: "bold",
              }}
            >
              Call
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </>
  );
}
