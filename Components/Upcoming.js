import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Appearance } from "react-native";
import { RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Font from "expo-font";

const Upcoming = ({ navigation }) => {
  const [data, setData] = useState([]);
  const colorScheme = Appearance.getColorScheme();
  const currentTime = new Date();
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const response = await fetch(
          `http://backend.eastwayvisa.com/api/bookings/clientId/${userId}`
        );
        if (response.ok) {
          const allData = await response.json();

          // Filter the data based on status
          const filteredData = allData.filter(
            (item) =>
              item.status === "Accepted" ||
              item.status === "" ||
              item.status === "WorkOnIt" ||
              item.status === "PickUp"
          );

          setData(filteredData);
        } else {
          console.error("Failed to fetch data");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  //for refreshing the field

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Polling interval (e.g., every 5 seconds)
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000); // Adjust the interval as needed

    // Cleanup the interval on component unmount
    return () => clearInterval(pollingInterval);
  }, []);

  const updatedAppointment = route.params?.updatedAppointment;

  // Check if updatedAppointment exists and update the local state
  if (updatedAppointment) {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === updatedAppointment._id ? updatedAppointment : item
      )
    );
  }

  // const handleCancelAppointment = (appointmentId) => {
  //   Alert.alert(
  //     'Confirm Cancellation',
  //     'Are you sure you want to cancel this appointment?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Confirm',
  //         onPress: () => {
  //           // Make a DELETE request to the API to cancel the appointment
  //           fetch(
  //             `http://backend.eastwayvisa.com/api/bookings/${appointmentId}`,
  //             {
  //               method: 'DELETE',
  //             }
  //           )
  //             .then((response) => {
  //               if (response.ok) {
  //                 // Appointment was successfully canceled
  //                 // You may want to update your local state to remove the canceled appointment
  //                 const updatedData = data.filter(
  //                   (item) => item._id !== appointmentId
  //                 );
  //                 setData(updatedData);
  //               } else {
  //                 console.error('Failed to cancel appointment');
  //               }
  //             })
  //             .catch((error) => {
  //               console.error('Error canceling appointment:', error);
  //             });
  //         },
  //       },
  //     ]
  //   );
  // };

  // const handleCancelAppointment = async (appointmentId) => {
  //   Alert.alert(
  //     'Confirm Cancellation',
  //     'Are you sure you want to cancel this appointment?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Confirm',
  //         onPress: async () => {
  //           try {
  //             // Update the status to 'Declined' before canceling the appointment
  //             const updateStatusResponse = await fetch(
  //               `http://backend.eastwayvisa.com/api/bookings/${appointmentId}`,
  //               {
  //                 method: 'PATCH',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({
  //                   status: 'Declined',
  //                 }),
  //               }
  //             );

  //             if (updateStatusResponse.ok) {
  //
  //             } else {
  //               console.error('Failed to update status to Declined');
  //               return;
  //             }

  //             // Make a DELETE request to the API to cancel the appointment
  //             const cancelResponse = await fetch(
  //               `http://backend.eastwayvisa.com/api/bookings/${appointmentId}`,
  //               {
  //                 method: 'DELETE',
  //               }
  //             );

  //             if (cancelResponse.ok) {
  //

  //               // Update the local state
  //               const updatedData = data.filter(
  //                 (item) => item._id !== appointmentId
  //               );
  //               setData(updatedData);
  //             } else {
  //               console.error('Failed to cancel appointment');
  //             }
  //           } catch (error) {
  //             console.error('Error canceling appointment:', error);
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };
  const handleCancelAppointment = async (appointmentId) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              // Update the status to 'Declined' using the PATCH method
              const updateStatusResponse = await fetch(
                `http://backend.eastwayvisa.com/api/bookings/${appointmentId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    status: "Declined",
                  }),
                }
              );

              if (updateStatusResponse.ok) {
              } else {
                console.error("Failed to update status to Declined");
                return;
              }
              const userId = await AsyncStorage.getItem("userId");

              // Fetch the updated list of bookings
              const updatedResponse = await fetch(
                `http://backend.eastwayvisa.com/api/bookings/clientId/${userId}`
              );

              if (updatedResponse.ok) {
                const updatedData = await updatedResponse.json();

                setData(updatedData);
              } else {
                console.error("Failed to fetch updated data");
              }
            } catch (error) {
              console.error("Error canceling appointment:", error);
            }
          },
        },
      ]
    );
  };

  const handleTrack = (item) => {
    navigation.navigate("DeliveryScreen", {
      date: item.date,
      time: item.time,
      servicesName: item.servicesName,
      totalPrice: item.totalPrice,
      locationId: item.locationId,
      agentId: item.agentId,
    });
  };

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <>
      <View style={[styles.header, commonStyles]}>
        <ScrollView
          vertical={true}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
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
          <View style={styles.container}>
            {data.map((item) => (
              <View key={item._id} style={styles.promotioncard}>
                <View style={styles.promotioncardContent}>
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    style={styles.promotionimage}
                    resizeMode="contain"
                  />
                  <View style={styles.promotiondetails}>
                    <Text
                      style={styles.promotionserviceName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.servicesName}
                    </Text>
                    <Text style={styles.promotiondate}>
                      {moment(item.date, "DD-MM-YYYY").format("DD-MM-YYYY")}
                    </Text>
                    <Text style={styles.promotionclock}>{item.time}</Text>
                    <Text style={styles.promotionprice}>
                      Rs. {item.totalPrice}
                    </Text>
                  </View>
                  {/* <View>
                    {item.status === 'Accepted' ? (
                      <TouchableOpacity style={styles.trackButton} onPress={() => handleTrack(item)}>
                        <Entypo name="location-pin" size={24} color="white" />
                      </TouchableOpacity>
                    ) : null}
                  </View> */}
                  {item.status === "PickUp" ? (
                    <TouchableOpacity
                      style={styles.trackButton}
                      onPress={() => handleTrack(item)}
                    >
                      <Entypo name="location-pin" size={24} color="white" />
                    </TouchableOpacity>
                  ) : null}
                  {/* {item.status === 'WorkOnIt' ? (
                    <TouchableOpacity style={styles.trackButton} onPress={() => handleTrack(item)}>
                      <Entypo name="location-pin" size={24} color="white" />
                    </TouchableOpacity>
                  ) : null} */}
                </View>
                <View style={styles.buttonContainer}>
                  {item.status === "Accepted" ? (
                    <>
                      <Text
                        style={
                          item.status === "Accepted"
                            ? styles.confirmedStatus
                            : styles.pendingStatus
                        }
                      >
                        {item.status === "" ? "Pending" : item.status}
                      </Text>

                      {item.status == "WorkOnIt" || item.status == "PickUp" || (
                        <View style={styles.rescheduleButton}>
                          <Text style={styles.buttonText}> No Reschedule</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelAppointment(item._id)}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text
                        style={
                          item.status === "Accepted"
                            ? styles.confirmedStatus
                            : styles.pendingStatus
                        }
                      >
                        {item.status === "" ? "Pending" : item.status}
                      </Text>

                      <TouchableOpacity
                        style={styles.rescheduleButton}
                        onPress={() => {
                          navigation.navigate("UpdateInfo", {
                            appointment: item,
                          });
                        }}
                      >
                        <Text style={styles.buttonText}>Reschedule</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelAppointment(item._id)}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#D8D8D8",
  },

  container: {
    flex: 1,
    paddingHorizontal: 10,
    // paddingVertical: 10,
  },
  promotioncard: {
    flexDirection: "column",
    backgroundColor: "white",
    height: 200,
    width: 370,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2, // Add shadow for Android
    shadowColor: "rgba(0, 0, 0, 0.2)", // Add shadow for iOS
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  promotioncardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    // paddingVertical: 5,
  },
  promotionimage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    margin: 10,
  },
  promotiondetails: {
    flex: 1,
    marginRight: 10,
  },
  promotionserviceName: {
    fontSize: 15,
    marginBottom: 5,
  },
  promotiondate: {
    fontSize: 15,
    marginTop: 5,
  },
  promotionclock: {
    fontSize: 15,
    marginTop: 5,
  },
  promotionprice: {
    fontSize: 15,
    marginTop: 5,
  },
  trackButton: {
    backgroundColor: "skyblue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    bottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Change to 'space-evenly' for even spacing
    marginHorizontal: 5,
    marginTop: 10,
  },
  confirmedStatus: {
    backgroundColor: "#33B864",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontFamily: "Roboto-Bold",
  },
  pendingStatus: {
    backgroundColor: "#FCAE1E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontFamily: "Roboto-Bold",
  },
  rescheduleButton: {
    backgroundColor: "#f8db03",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#FF2E2E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    textAlign: "center",
  },
});

export default Upcoming;
