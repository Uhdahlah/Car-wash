import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
  ScrollView,
} from "react-native";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (time) => {
  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes} ${ampm}`;
};

const TopserviceConfirmation = ({ route, navigation }) => {
  const { servicesName, price1, pickupAddress, date, time } = route.params;
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    selectedOption === "pickup" ? 300 : 0
  );
  const [clientvehicleno, setClientVehicleNo] = useState("");
  const [clientcarmodelno, setClientCarModelNo] = useState("");
  const [vehicleNumberError, setVehicleNumberError] = useState("");
  const [modelNumberError, setModelNumberError] = useState("");
  const colorScheme = Appearance.getColorScheme();

  const [selectedOption, setSelectedOption] = useState("pickup");
  const [clientData, setClientData] = useState([]);

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
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const response = await fetch(
        "http://backend.eastwayvisa.com/api/clients"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientData(data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

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

  const validateFields = () => {
    let isValid = true;

    if (clientvehicleno.trim() === "") {
      setVehicleNumberError("*Vehicle Number is required");
      isValid = false;
    } else {
      setVehicleNumberError("");
    }

    if (clientcarmodelno.trim() === "") {
      setModelNumberError("*Model Number is required");
      isValid = false;
    } else {
      setModelNumberError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const pickuptoagent =
        selectedOption === "pickup" ? "pickuptoagent" : "No";
      const selfdrive = selectedOption === "selfdrive" ? "selfdrive" : "No";

      const {
        pickupAddress,
        date,
        time,
        servicesName,
        status,
        price1,
        image1,
      } = route.params;
      const image = image1;
      const taxAmount = price1 * 0.1;
      const formattedTaxAmount = taxAmount.toFixed(2);

      let optionValue = 0;

      if (selectedOption === "pickup") {
        optionValue = 300;
      }

      const totalPrice = (
        price1 +
        parseFloat(formattedTaxAmount) +
        optionValue
      ).toFixed(2);
      const formattedDate = moment(date).format("DD-MM-YYYY");
      const formattedTime = moment(time).format("hh:mm A");

      try {
        const userId = await AsyncStorage.getItem("userId");
        const selectedClient = clientData.find(
          (client) => client._id === userId
        );

        if (selectedClient) {
          fetch("http://backend.eastwayvisa.com/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: formattedDate,
              time: formattedTime,
              pickupAddress: pickupAddress,
              servicesName,
              image,
              totalPrice: totalPrice,
              status: "",
              agentId: "",
              clientcarmodelno: clientcarmodelno,
              clientvehicleno: clientvehicleno,
              pickuptoagent: pickuptoagent,
              selfdrive: selfdrive,
              userId: userId,
              clientId: selectedClient._id,
              clientName: selectedClient.clientName,
              clientContact: selectedClient.clientPhone,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              navigation.navigate("Confirm");
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          console.error("Selected client not found in client data.");
        }
      } catch (error) {
        console.error("Error retrieving user ID from AsyncStorage:", error);
      }
    }
  };

  //   const taxAmount = price1 * 0.10;
  //   const totalPrice = price1 + taxAmount + selectedOptionValue;
  const taxAmount = price1 * 0.1;
  const formattedTaxAmount = taxAmount.toFixed(2);

  let optionValue = 0;

  if (selectedOption === "pickup") {
    optionValue = 300;
  }

  const totalPrice = (
    price1 +
    parseFloat(formattedTaxAmount) +
    optionValue
  ).toFixed(2);

  const formattedDate = moment(date).format("DD-MM-YYYY");
  const formattedTime = moment(time).format("hh:mm A");

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <>
      <View style={[styles.header, commonStyles]}>
        <ScrollView
          Vertical={true}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <View
              style={{
                height: 65,
                backgroundColor: "white",
                marginVertical: 10,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  padding: "4%",
                  justifyContent: "space-evenly",
                }}
              >
                <MaterialCommunityIcons
                  name="car-wash"
                  size={35}
                  color="black"
                />
                <View>
                  <Text style={{ fontFamily: "Poppins-Bold" }}>
                    Service Name
                  </Text>
                  <Text>{servicesName}</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: "Poppins-Bold" }}>Price</Text>
                  <Text>{price1}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 65,
                backgroundColor: "white",
                marginVertical: 10,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  margin: 15,
                }}
              >
                <View>
                  <Text style={{ fontFamily: "Poppins-Bold" }}>Date</Text>
                  <Text>{formattedDate}</Text>
                  {/* <Text>{date}</Text> */}
                </View>
                <View>
                  <Text style={{ fontFamily: "Poppins-Bold" }}>Time</Text>
                  <Text>{formattedTime}</Text>
                  {/* <Text>{time}</Text> */}
                </View>
              </View>
            </View>
            <View
              style={{
                height: 60,
                backgroundColor: "white",
                marginVertical: 10,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "black",
              }}
            >
              <View style={{ flexDirection: "row", padding: 10 }}>
                <Text style={{ fontFamily: "Poppins-Bold" }}>Address: </Text>
                <Text
                  style={{ fontFamily: "Roboto-Regular", resizeMode: "cover" }}
                >
                  {pickupAddress}
                </Text>
              </View>
            </View>
            <Text style={{ fontFamily: "Poppins-Bold" }}>
              Enter Vehicle Number<Text style={{ color: "red" }}> *</Text>
            </Text>
            <TextInput
              placeholder="Ex:MH01AE8017"
              placeholderTextColor="#000"
              onChangeText={(text) => setClientVehicleNo(text.toUpperCase())}
              value={clientvehicleno}
              style={styles.input}
            />
            <Text style={styles.errorText}>{vehicleNumberError}</Text>
            <Text style={{ fontFamily: "Poppins-Bold" }}>
              Enter Make/Model Number<Text style={{ color: "red" }}> *</Text>
            </Text>
            <TextInput
              placeholder="Ex. Suzuki/Swift"
              placeholderTextColor="#000"
              onChangeText={(text) => setClientCarModelNo(text.toUpperCase())}
              value={clientcarmodelno}
              style={styles.input}
            />
            <Text style={styles.errorText}>{modelNumberError}</Text>
            <View style={styles.pickerContainer}>
              <Text style={{ fontFamily: "Poppins-Bold" }}>
                Select an option:
              </Text>
              <Picker
                style={[styles.picker, { borderRadius: 8 }]}
                selectedValue={selectedOption}
                onValueChange={(itemValue) => {
                  setSelectedOption(itemValue);
                  let optionValue = 0;
                  if (itemValue === "pickup") {
                    optionValue = 300;
                  }
                  setSelectedOptionValue(optionValue);
                }}
              >
                <Picker.Item label="Pickup by Agent" value="pickup" />
                <Picker.Item label="Self Drive" value="selfdrive" />
              </Picker>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginVertical: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {selectedOption === "pickup" ? "Pickup By Agent" : "Self Drive"}
              </Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={{ fontWeight: "bold" }}>
                  {selectedOption === "pickup" ? optionValue : "0"}
                </Text>
              </View>
            </View>

            <View style={styles.amount}>
              <Text style={styles.text2}>SERVICE PRICE</Text>
              <Text style={styles.text2}>{price1}</Text>
            </View>
            <View style={styles.amount}>
              <Text style={styles.text2}>TAXES</Text>
              <Text style={styles.text2}>{formattedTaxAmount}</Text>
            </View>
            <View style={styles.amount}>
              <Text style={styles.text2}>TOTAL PAYABLE </Text>
              <Text style={styles.text2}>{totalPrice}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.maincontainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <View style={styles.iconsContainer1}>
            <View style={styles.text9}>
              <TouchableOpacity onPress={handleIconPressHome}>
                <Entypo name="home" size={30} style={styles.icon4} />
              </TouchableOpacity>
              <Text style={styles.text10}>Home</Text>
            </View>
            <View style={styles.text9}>
              <TouchableOpacity onPress={handleIconPressBook}>
                <Entypo name="calendar" size={30} style={styles.icon4} />
              </TouchableOpacity>
              <Text style={styles.text10}>Booking</Text>
            </View>
            <View style={styles.text9}>
              <TouchableOpacity onPress={handleIconPressNotification}>
                <MaterialIcons
                  name="forward-to-inbox"
                  size={30}
                  style={styles.icon4}
                />
              </TouchableOpacity>
              <Text style={styles.text10}>Inbox</Text>
            </View>
            {/* <View style={styles.text9}>
              <TouchableOpacity onPress={openSettings}>
                <Ionicons
                  name="settings-sharp"
                  size={30}
                  style={styles.icon4}
                />
              </TouchableOpacity>
              <Text style={styles.text10}>Setting</Text>
            </View> */}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#D8D8D8",
    width: "100%",
    height: "100%",
  },
  container: {
    paddingTop: 15,
    padding: 15,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  text1: {
    height: 45,
    borderWidth: 2,
    borderColor: "grey",
    paddingLeft: 15,
  },
  date1: {
    flexDirection: "row",
  },
  voucher1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  apply: {
    height: 45,
    borderWidth: 2,
    borderColor: "grey",
    backgroundColor: "yellow",
  },
  amount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  text2: {
    fontWeight: "bold",
    fontSize: 13,
  },
  input: {
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 8,
    padding: 5,
    marginBottom: 5,
    backgroundColor: "white",
    height: 60,
  },
  errorText: {
    color: "red",
  },
  pickerContainer: {
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 8,
  },
  picker: {
    backgroundColor: "white",
    fontWeight: "bold",
    borderRadius: 8,
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  maincontainer: {
    position: "relative",
  },
  button: {
    position: "relative",
    backgroundColor: "#5B7586",
    height: 45,

    paddingTop: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    textAlign: "center",
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
  },
  icon4: {
    marginHorizontal: 40,
  },
  text9: {
    alignItems: "center",
  },
  text10: {
    fontSize: 10,
  },
  item: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default TopserviceConfirmation;
