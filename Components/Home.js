import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { Dimensions } from "react-native";

import { Appearance } from "react-native";
import { RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faBell } from "@fortawesome/free-regular-svg-icons/faBell";
import { faUser } from "@fortawesome/free-regular-svg-icons/faUser";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";

import { Ionicons } from "@expo/vector-icons";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Font from "expo-font";

function Home(props) {
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  // const [searchText, setSearchText] = useState("");

  const [servicesData, setServicesData] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [myFetchedData, setMyFetchedData] = useState([]);
  const [homeOffers, setHomeOffers] = useState([]);
  const colorScheme = Appearance.getColorScheme();
  const [upcomingdata, setupcomingData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const [activeIcon, setActiveIcon] = useState("Home");

  const [searchText, setSearchText] = useState("");
  const [filteredServicesData, setFilteredServicesData] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [filteredHomeOffers, setFilteredHomeOffers] = useState([]);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Teko-Regular": require("../assets/fonts/Teko-Regular.ttf"),

        "Roboto-BlackItalic": require("../assets/fonts/Roboto-BlackItalic.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),

        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),

        "RobotoSlab-Light": require("../assets/fonts/RobotoSlab-Light.ttf"),
      });
    };

    loadFonts();
  }, []);

  useEffect(() => {
    // Filter servicesData based on search text
    const filteredServices = servicesData.filter(
      (service) =>
        service.serviceName &&
        service.serviceName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServicesData(filteredServices);

    // Filter promotions based on search text
    const filteredPromos = promotions.filter(
      (promo) =>
        promo.title &&
        promo.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPromotions(filteredPromos);

    // Filter home offers based on search text
    const filteredOffers = homeOffers.filter(
      (offer) =>
        offer.homeservicesName &&
        offer.homeservicesName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredHomeOffers(filteredOffers);
  }, [searchText, servicesData, promotions, homeOffers]);

  useEffect(() => {
    callApiOffers();
    callApiPromotion();
    callApiService();
    fetchservices();
    setActiveIcon("Home");
  }, []);

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
              item.status === "PickUp" ||
              item.status === "WokOnIt"
          );

          setupcomingData(filteredData);
        } else {
          console.error("Failed to fetch data");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function callApiOffers() {
    const apiUrl = "http://backend.eastwayvisa.com/api/homeoffers";
    try {
      let resp = await fetch(apiUrl);
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      let respJson = await resp.json();
      setHomeOffers(respJson);
    } catch (error) {
      console.error("Error fetching promotion:", error);
    }
  }
  function formatDateToMonthRange(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Adding 1 to convert from 0-indexed month
    return `${month}th-${month + 7}th month`;
  }
  function handleofferClick(homeservicesName, description, totalPrice, image) {
    // Navigate to a new page or display details

    props.navigation.navigate("Booknow", {
      homeservicesName,
      description,
      totalPrice,
      image,
    });
  }

  async function callApiPromotion() {
    const apiUrl = "http://backend.eastwayvisa.com/api/promotions";
    try {
      let resp = await fetch(apiUrl);
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      let respJson = await resp.json();
      setPromotions(respJson);
    } catch (error) {
      console.error("Error fetching promotion:", error);
    }
  }

  function handlePromotionClick(service, description, promotionPrice, image) {
    // Navigate to a new page or display details
    props.navigation.navigate("Promotion", {
      service,
      description,
      promotionPrice,
      image,
    });
  }
  function handlePromotionPageClick(
    service,
    description,
    promotionPrice,
    image
  ) {
    // Navigate to a new page or display details
    props.navigation.navigate("PromotionPage", {
      service,
      description,
      promotionPrice,
      image,
    });
  }
  async function callApiService() {
    const apiUrl = "http://backend.eastwayvisa.com/api/topservices";
    try {
      let resp = await fetch(apiUrl);
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      let respJson = await resp.json();
      setMyFetchedData(respJson);
    } catch (error) {
      console.error("Error fetching promotion:", error);
    }
  }

  function handleTopservicesClick(title, description, price, image) {
    // Navigate to a new page or display details
    props.navigation.navigate("Topservice", {
      title,
      description,
      price,
      image,
    });
  }
  function fetchservices() {
    fetch("http://backend.eastwayvisa.com/api/services")
      .then((response) => response.json())
      .then((data) => {
        setServicesData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function toggleSearchBar() {
    setSearchBarOpen((prev) => !prev);
  }

  // Custom navigation function
  const navigateToScreen = (screenName) => {
    setActiveIcon(screenName);
    props.navigation.navigate(screenName);
  };

  useFocusEffect(
    React.useCallback(() => {
      // This code will run when the screen is focused.
      setActiveIcon("Home");
    }, [])
  );

  // for notification
  function handleIconPressNotification() {
    props.navigation.navigate("Notification"); // Navigate to the Notification screen
  }

  // for Profile
  function handleIconPressProfile() {
    props.navigation.navigate("Profile"); // Navigate to the Profile screen
  }

  // for home
  function handleIconPressHome() {
    props.navigation.navigate("Home"); // Navigate to the home screen
  }
  // for Booking
  const handleIconPressBook = () => {
    props.navigation.navigate("Appointment"); // Navigate to the Appointment screen
  };

  // for services
  function handleIconPressService(
    serviceName,
    serviceDescription,
    servicePrice,
    serviceImage
  ) {
    props.navigation.navigate("Washing", {
      serviceName,
      serviceDescription,
      servicePrice,
      serviceImage,
    }); // Navigate to the Washing screen
  }

  // for setting
  async function openSettings() {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error("Error opening settings:", error);
    }
  }

  const commonStyles = {
    color: colorScheme === "dark" ? "#fff" : "#000",
  };

  if (servicesData.length === 0) {
    return <Text>Loading...</Text>;
  }

  //for refreshing the field

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  //For dot
  const renderPaginationDots = () => {
    return homeOffers.map((_, index) => (
      <View
        key={index}
        style={[
          styles.paginationDot,
          { backgroundColor: index === activeCardIndex ? "black" : "grey" },
        ]}
      />
    ));
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardIndex = Math.round(contentOffset / 330); // Assuming each card has a width of 195

    setActiveCardIndex(cardIndex);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];

    return { day, month };
  };

  return (
    <>
      <View style={[styles.header, commonStyles]}>
        <View style={styles.navbar}>
          <Text style={styles.gloss}>Carwash</Text>

          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={toggleSearchBar}>
              {/* <FontAwesomeIcon icon={faMagnifyingGlass} size={25} color="black" style={styles.icon} /> */}
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType="slide"
              visible={isSearchBarOpen}
              onRequestClose={toggleSearchBar}
            >
              <View style={styles.modalContainer}>
                <View style={styles.searchBarContainer}>
                  <TextInput
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                  />
                  <TouchableOpacity
                    onPress={toggleSearchBar}
                    style={styles.closeIcon}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} size={25} />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TouchableOpacity onPress={handleIconPressNotification}>
              <FontAwesomeIcon
                icon={faBell}
                size={25}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleIconPressProfile}>
              <FontAwesomeIcon
                icon={faUser}
                size={25}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.search}>
          <Ionicons name="search" size={24} color="black" style={styles.searchicon} />
          <TextInput
            style={styles.searchinput}
            placeholder="Search..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View> */}
        <ScrollView
          Vertical={true}
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
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            pagingEnabled={true}
          >
            {homeOffers.map((offer) => (
              <View
                key={offer._id}
                style={[styles.Section, { width: screenWidth }]}
              >
                <View
                  style={{
                    height: 130,
                    width: 175,
                    backgroundColor: "#F2F3F4",
                    borderBottomLeftRadius: 10,
                    borderTopLeftRadius: 10,
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                >
                  <Text style={styles.text1}>{offer.offerName}</Text>
                  <Text
                    style={{ color: "#f2003c", marginHorizontal: 20 }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {["-", offer.offer, " OFF"]}
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      handleofferClick(
                        offer.homeservicesName,
                        offer.description,
                        offer.totalPrice,
                        offer.image
                      )
                    }
                  >
                    <Text style={styles.Booknow}>Book Now</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "start",
                      marginHorizontal: 20,
                    }}
                  >
                    <Text>{`${formatDate(offer.startDate).day} ${
                      formatDate(offer.startDate).month
                    } - ${formatDate(offer.endDate).day} ${
                      formatDate(offer.endDate).month
                    }`}</Text>
                  </View>
                </View>

                <View
                  style={{
                    height: 130,
                    width: 175,
                    backgroundColor: "#F2F3F4",
                    marginVertical: 10,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Image
                    source={{ uri: offer.image }}
                    style={styles.img}
                    resizeMode="cover"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.paginationContainer}>
            <View style={styles.paginationDotsWrapper}>
              {renderPaginationDots()}
            </View>
          </View>

          {/* <Text style={styles.text3}>Services</Text> */}
          <View style={styles.Services}>
            <Text style={styles.text3}>Services</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => props.navigation.navigate("ServicePage")}
            >
              {/* <Text style={styles.viewAllText}>View All</Text> */}
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {/* <View style={styles.icon3}>
              {servicesData.map((service) => (
                <View key={service._id} style={styles.cardContainer}>
                  <Image
                    source={{ uri: 'https://www.hdwallpapers.in/download/chevrolet_camaro_coupe_muscle_car_red_car_hd_cars-HD.jpg' }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.servicePrice}>Rs.{service.servicePrice}</Text>
                  <TouchableOpacity
                    style={styles.bookServiceButton}
                    onPress={() => handleIconPressService(service.serviceName, service.serviceDescription, service.servicePrice, service.serviceImage)}
                  >
                    <Text style={styles.bookServiceButtonText}>Book Service</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View> */}
            <View
              style={{ flex: 1, flexDirection: "row", marginHorizontal: 20 }}
            >
              {servicesData.map((service, index) => (
                <View
                  key={service._id}
                  style={[
                    styles.servicecard,
                    {
                      borderBottomLeftRadius: index === 0 ? 10 : 0,
                      borderTopLeftRadius: index === 0 ? 10 : 0,
                      borderBottomRightRadius:
                        index === servicesData.length - 1 ? 10 : 0,
                      borderTopRightRadius:
                        index === servicesData.length - 1 ? 10 : 0,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.bookServiceButton}
                    onPress={() =>
                      handleIconPressService(
                        service.serviceName,
                        service.serviceDescription,
                        service.servicePrice,
                        service.serviceImage
                      )
                    }
                  >
                    {/* <Image source={require('../Components/Assets/Carwash.png')} style={styles.serviceimage} /> */}
                    <Image
                      source={{ uri: service.serviceImage }}
                      style={styles.serviceimage}
                      resizeMode="contain"
                    />

                    <View style={styles.servicetitleContainer}>
                      <Text
                        style={styles.servicetitle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {service.serviceName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.Services}>
            <Text style={styles.text3}>Upcoming Booking</Text>
          </View>
          <View style={styles.containerBooking}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
              pagingEnabled={true}
            >
              {upcomingdata.map((item) => (
                <View key={item._id} style={styles.upcomingcard}>
                  <View style={styles.upcomingcardContent}>
                    <Image
                      source={{
                        uri: item.image,
                      }}
                      style={styles.upcomingimage}
                      resizeMode="contain"
                    />

                    <View style={styles.upcomingdetails}>
                      <Text
                        style={styles.upcomingserviceName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.servicesName}
                      </Text>
                      <Text style={styles.upcomingdate}>
                        {moment(item.date, "DD-MM-YYYY").format("DD-MM-YYYY")}
                      </Text>
                      <Text style={styles.upcomingclock}>{item.time}</Text>
                      <Text style={styles.upcomingprice}>
                        Rs. {item.totalPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.ViewBooking}
                      onPress={() => props.navigation.navigate("Appointment")}
                    >
                      <Text style={styles.buttonText}>View Booking</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.Services}>
            <Text style={styles.text3}>Promotions</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => handlePromotionPageClick()}
            >
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={true}
            style={styles.promotion2}
            showsHorizontalScrollIndicator={false}
          >
            {promotions.map((promotion) => (
              <View style={styles.Promotion} key={promotion._id}>
                <TouchableOpacity
                  onPress={() =>
                    handlePromotionClick(
                      promotion.service,
                      promotion.description,
                      promotion.promotionPrice,
                      promotion.image
                    )
                  }
                >
                  {/* <Image source={{ uri: 'https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/rolls_royce_phantom_top_10.jpg?itok=XjL9f1tx' }} style={styles.promotionitem} /> */}
                  <Image
                    source={{ uri: promotion.image }}
                    style={styles.promotionitem}
                  />
                  <View style={styles.titleContainer}>
                    <Text
                      style={styles.title}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {promotion.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.Services}>
            <Text style={styles.text3}>Top Services</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => props.navigation.navigate("TopservicePage")}
            >
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={true}
            style={styles.topservice2}
            showsHorizontalScrollIndicator={false}
          >
            {myFetchedData.map((topservice) => (
              <View key={topservice._id}>
                <TouchableOpacity
                  onPress={() =>
                    handleTopservicesClick(
                      topservice.title,
                      topservice.description,
                      topservice.price,
                      topservice.image
                    )
                  }
                >
                  {/* <Image source={{ uri: 'https://i2.cdn.turner.com/money/galleries/2010/autos/1011/gallery.2010_los_angeles_auto_show/images/2012_buick_regal_gs.jpg' }} style={styles.item} /> */}
                  <Image
                    source={{ uri: topservice.image }}
                    style={styles.item}
                    resizeMode="contain"
                  />
                  <Text
                    style={{ marginTop: 5, fontFamily: "Roboto-Bold" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {topservice.title}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
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
              <TouchableOpacity
                onPress={() => navigateToScreen("Notification")}
              >
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#D8D8D8",
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    paddingTop: 15,
  },
  gloss: {
    fontSize: 30,
    fontFamily: "Teko-Regular",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 15,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchicon: {
    marginRight: 8,
  },
  searchinput: {
    flex: 1,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  searchBarContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    margin: 8,
  },
  Section: {
    marginBottom: 10,
    flexDirection: "row",
  },
  text1: {
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 10,
    fontFamily: "Roboto-Bold",
  },
  button: {
    width: 100,
    height: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    backgroundColor: "#f8db03",
  },
  Booknow: {
    fontSize: 15,
    textAlign: "center",
    marginVertical: 5,
    fontFamily: "Roboto-Bold",
  },
  img: {
    height: 130,
    width: 175,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },

  paginationContainer: {
    alignItems: "center",
  },
  paginationDotsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    margin: 2,
  },
  Services: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
    marginBottom: 10,
  },
  text3: {
    fontSize: 17,
    fontFamily: "Poppins-Bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },

  // icon3: {
  //   flexDirection: "row",
  //   marginHorizontal: 10,
  // },
  // cardContainer: {
  //   width: 200,
  //   height: 200,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   padding: 10,
  //   alignItems: 'center',
  //   shadowColor: 'rgba(0,0,0,0.2)',
  //   shadowOpacity: 0.5,
  //   marginHorizontal: 5,
  //   marginBottom: 10,
  //   shadowOffset: {
  //     width: 0,
  //   },
  // },
  // image: {
  //   width: "90%",
  //   height: '55%',
  //   resizeMode: 'cover',
  //   borderRadius: 4
  // },

  // price: {
  //   fontSize: 16,
  //   marginTop: 5,
  // },
  // bookServiceButton: {
  //   backgroundColor: '#f8db03',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginTop: 5,
  // },
  // bookServiceButtonText: {
  //   color: 'black',
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  servicecard: {
    backgroundColor: "#fff",
    width: 150,
    height: 100,
    elevation: 5,
    marginBottom: 20,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  serviceimage: {
    height: 50,
    resizeMode: "contain",
    width: "100%",
  },
  servicetitleContainer: {
    alignItems: "center",
  },

  servicetitle: {
    fontSize: 15,
    fontFamily: "Roboto-Bold",
    padding: 5,
  },

  serviceName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  servicePrice: {
    color: "green",
  },
  containerBooking: {
    flexDirection: "row",
    width: 360,
    marginHorizontal: 15,
  },

  upcomingcard: {
    flexDirection: "column",
    backgroundColor: "white",
    height: 170,
    width: 350,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 2, // Add shadow for Android
    shadowColor: "rgba(0, 0, 0, 0.2)", // Add shadow for iOS
    shadowOpacity: 0.5,
    marginBottom: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  upcomingcardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  upcomingimage: {
    width: 120,
    height: 95,
    resizeMode: "cover",
    borderRadius: 10,
    margin: 10,
  },
  upcomingdetails: {
    flex: 1,
    marginRight: 10,
  },
  upcomingserviceName: {
    fontSize: 15,
    marginBottom: 5,
  },
  upcomingdate: {
    fontSize: 15,
    marginTop: 5,
  },
  upcomingclock: {
    fontSize: 15,
    marginTop: 5,
  },
  upcomingprice: {
    fontSize: 15,
    marginTop: 5,
  },

  buttonContainer: {
    width: 150,
    marginLeft: 180,
    marginTop: 10,
  },

  ViewBooking: {
    backgroundColor: "#f8db03",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  buttonText: {
    color: "black",
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    textAlign: "center",
  },

  promotion2: {
    marginHorizontal: 15,
  },

  Promotion: {
    width: 200,
    // height:150,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginBottom: 10,
  },
  promotionitem: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  titleContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Bold",
  },

  topservice2: {
    marginHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    height: 130,
    width: 180,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
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

export default Home;
