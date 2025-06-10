import axios from "axios";
import { useEffect, useRef } from "react";
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { icons, images } from "@/constants";
import ServiceList from "@/components/componentClient/ServiceList";
import ProviderDetailsScreen from "@/components/componentClient/ProviderDetailsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceList2 from "@/components/componentClient/ServiceList2";

const screenWidth = Dimensions.get("window").width;

const allServices = [
  { label: "Cleaning", icon: icons.cleanoo },
  { label: "Repairing", icon: icons.clemol },
  { label: "Painting", icon: icons.paintt },
  { label: "Laundry", icon: icons.launn },
  { label: "Appliance", icon: icons.mart },
  { label: "Plumbing", icon: icons.plomm },
  { label: "Shifting", icon: icons.car },
  { label: "Beauty", icon: icons.beau },
  { label: "AC Repair", icon: icons.acr },
  { label: "Vehicle", icon: icons.carpt },
  { label: "Electronics", icon: icons.pcp },
  { label: "Massage", icon: icons.masso },
  { label: "Men’s Salon", icon: icons.mensalon },
];

const defaultServices = allServices.slice(0, 7).concat({ label: "More", icon: icons.mor });

const popularCategories = [
  "All", "Cleaning", "Painting", "Laundry", "Appliance",
  "Plumbing", "Shifting", "Repairing", "Massage"
];

const categories = [...popularCategories, "Beauty", "Vehicle"];
const ratings = ["All", "5", "4", "3", "2", "1"];
export default function HomeScreen() {
  const [chatbotVisible, setChatbotVisible] = useState(false); // Line 30
  const [userMessage, setUserMessage] = useState<string>(""); // Line 31
  const [notifCount, setNotifCount] = useState(0);

  const [chatbotResponse, setChatbotResponse] = useState<string>(""); // Line 32
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);
  const [classicChatbotVisible, setClassicChatbotVisible] = useState(false);
  const [classicResponse, setClassicResponse] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const [classicInput, setClassicInput] = useState("");



  const [mapFilterCategory, setMapFilterCategory] = useState<string>("All");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showFullMap, setShowFullMap] = useState(false);
  const [clientName, setClientName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [fetchedServices, setFetchedServices] = useState<any[]>([]);
  const router = useRouter();
  const navigation = useNavigation();
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [selectedPopular, setSelectedPopular] = useState("All");
  const [filteredPopularServices, setFilteredPopularServices] = useState<any[]>([]);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([50, 1000]);
  const [selectedRating, setSelectedRating] = useState("All");
  const [isSending, setIsSending] = useState(false);

  
  const fetchHistory = async (id: number) => {
  try {
    const res = await axios.get(`http://192.168.1.5:8000/chatbot/memory/history/${id}`)

    setMessageHistory(res.data);
  } catch (err) {
    console.error("Erreur récupération historique chatbot :", err);
  }

};

const getUnreadNotifs = async (id: number) => {
  try {
    const res = await axios.get(`http://192.168.1.5:8000/notifications/unread-count/${id}`);
    setNotifCount(res.data.count);
  } catch (err) {
    console.error("Erreur récupération notifications :", err);
  }
};
useEffect(() => {
  let interval: any;

  const startInterval = async () => {
    const id = await AsyncStorage.getItem("client_id");
    if (!id) return;

    interval = setInterval(() => {
      getUnreadNotifs(Number(id));
    }, 3000); // ⏱️ toutes les 10 secondes
  };

  startInterval();

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  setTimeout(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, 100); // petit délai pour laisser le rendu se faire
}, [messageHistory]);


  const defaultTabBarStyle = {
    height: 90,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#DADADA",
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  };

  useEffect(() => {
    const getName = async () => {
      try {
        const id = await AsyncStorage.getItem("client_id");
        if (!id) return;

        const res = await axios.get(`http://192.168.1.5:8000/home/client/${id}`);
        const { nom, prenom, photo } = res.data;
        setClientName(`${prenom} ${nom}`);
        setPhotoUrl(`${photo}`);
        setClientId(Number(id));
        fetchHistory(Number(id));
        getUnreadNotifs(Number(id));


      } catch (err) {
        console.error("Erreur récupération nom client :", err);
      }
    };

    getName();
  }, []);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission de localisation refusée');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: (selectedServiceCategory || showAllServices || selectedProvider)
        ? { display: "none" }
        : defaultTabBarStyle
    }); 
  }, [selectedServiceCategory, showAllServices, selectedProvider]);

  useEffect(() => {
    const category = selectedServiceCategory || mapFilterCategory;
    const url = category && category !== "All"
      ? `http://192.168.1.5:8000/home/prestataires?service=${category}`
      : `http://192.168.1.5:8000/home/prestataires`;

    axios.get(url)
      .then((res) => {
        const formatted = res.data.map((p: any) => ({
          id: p.prestataireID,
          name: p.nom,
          prenom: p.prenom,
          username: p.username,
          telephone: p.telephone,
          address: p.adresse,
          price: `${p.tarif} MAD`,
          rating: p.rating.toString(),
          image: { uri: p.photo?.startsWith("http") ? p.photo : `http://192.168.1.5:8000/${p.photo}` },
          longitude: Number(p.longitude),
          latitude: Number(p.latitude),
          typeTarif: p.typeTarif,
        }));
        setFetchedServices(formatted);
      })
      .catch((err) => {
        console.error("Erreur chargement prestataires:", err);
        setFetchedServices([]);
      });
  }, [selectedServiceCategory, mapFilterCategory]);

  useEffect(() => {
  if (!selectedPopular) return;

  const url =
    selectedPopular === "All"
      ? "http://192.168.1.5:8000/admin/approuved-prestataires"
      : `http://192.168.1.5:8000/home/prestataires?service=${selectedPopular}`;

  axios
    .get(url)
    .then((res) => {
      const formatted = res.data.map((p: any) => ({
        id: p.prestataireID,
        name: p.nom,
        prenom: p.prenom,
        username: p.username,
        telephone: p.telephone,
        address: p.adresse,
        price: `${p.tarif} MAD`,
        rating: p.rating?.toString() || "0",
        image: {
          uri: p.photo?.startsWith("http")
            ? p.photo
            : `http://192.168.1.5:8000/${p.photo}`,
        },
        longitude: Number(p.longitude) || 0,
        latitude: Number(p.latitude) || 0,
        typeTarif: p.typeTarif,
      }));
     const sortedTop5 = formatted
        .sort((a: { rating: string }, b: { rating: string }) =>
          parseFloat(b.rating) - parseFloat(a.rating)
        )
        .slice(0, 5); // ✅ garder uniquement les 5 meilleurs

      setFilteredPopularServices(sortedTop5);
    })
    .catch((err) => {
      console.error("Erreur chargement populaires:", err);
      setFilteredPopularServices([]);
    });
}, [selectedPopular]);

  const handleSelectProvider = async (provider: any) => {
    try {
      const res = await axios.get(`http://192.168.1.5:8000/home/prestataire/${provider.id}`);
      const detailed = res.data;
      const detailedProvider = {
        ...provider,
        prenom: detailed.prenom,
        username: detailed.username,
        telephone: detailed.tel,
        description: detailed.description,
        latitude: detailed.latitude,
        longtitude: detailed.longitude,
        typeTarif: detailed.typeTarif,
      };
      setSelectedProvider(detailedProvider);
    } catch (error) {
      console.error("Erreur lors du chargement du prestataire :", error);
    }
  };

  if (selectedProvider) {
    return <ProviderDetailsScreen provider={selectedProvider} onBack={() => setSelectedProvider(null)} />;
  }

  if (selectedServiceCategory) {
    return (
      <ServiceList
        title={selectedServiceCategory}
        services={fetchedServices}
        onBack={() => setSelectedServiceCategory(null)}
        onSelectProvider={handleSelectProvider}
      />
    );
  }

  

    return (
    <ImageBackground
      source={images.fondecran4}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {showAllServices ? (
          <View style={styles.fullscreenWhite}>
            <View style={styles.allServicesHeader}>
              <TouchableOpacity onPress={() => setShowAllServices(false)}>
                <Image source={icons.backArrow} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.allServicesTitle}>All Services</Text>
            </View>

            <FlatList
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20 }}
              data={allServices}
              numColumns={4}
              keyExtractor={(item) => item.label}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.serviceItem}
                  onPress={() => {
                    setShowAllServices(false);
                    setSelectedServiceCategory(item.label);
                  }}
                >
                  <View style={styles.serviceIconContainer}>
                    <Image source={item.icon} style={styles.serviceIcon} />
                  </View>
                  <Text style={styles.serviceLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.header}>
                  <View style={styles.profileSection}>
                    <TouchableOpacity onPress={() => router.push("/(tabs)/ee")}>
                      <View style={{ position: "relative" }}>
  <Image
    source={photoUrl ? { uri: photoUrl.startsWith("http") ? photoUrl : `http://192.168.1.5:8000/${photoUrl}` } : images.prof}
    style={styles.profileImage}
  />
  <View style={styles.onlineDot} />
</View>

                    </TouchableOpacity>
                    <View>
                      <Text style={styles.greeting}>Good Morning 👋</Text>
                      <Text style={styles.name}>{clientName || "..."}</Text>
                    </View>
                  </View>
                  <View style={styles.iconsRight}>
                    <TouchableOpacity onPress={() => router.push("../pages/pagesClient/NotificationClient")}>
  <View>
    <Image source={icons.notif} style={styles.iconSmall} />
    {notifCount > 0 && (
      <View style={{
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#DC2626",
        borderRadius: 12,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold", textAlign: "center" }}>
          {notifCount}
        </Text>
      </View>
    )}
  </View>
</TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("../pages/pagesClient/Favoris")}>
                      <Ionicons name="bookmark-outline" size={26} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={18} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                  />
                  <MaterialCommunityIcons
                    name="tune-variant"
                    size={18}
                    color="#7C3AED"
                    style={styles.iconRight}
                    onPress={() => setShowFilter(true)}
                  />
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Nearby Providers</Text>
                </View>

                <View style={styles.popularScroll}>
                  <FlatList
                    data={popularCategories}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.popularButton,
                          mapFilterCategory === item && styles.popularButtonSelected,
                        ]}
                        onPress={() => setMapFilterCategory(item)}
                      >
                        <Text
                          style={[
                            styles.popularButtonText,
                            mapFilterCategory === item && styles.popularButtonTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                 

                </View>

                <TouchableOpacity style={styles.mapContainer} onPress={() => setShowFullMap(true)}>
                  {location && (
                    <MapView
                      style={styles.miniMap}
                      region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      showsUserLocation
                    >
                      {fetchedServices.map((p, index) => (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude: p.latitude,
                            longitude: p.longitude,
                          }}
                        >
                          <Callout onPress={() => handleSelectProvider(p)}>
                            <View style={{ width: 180, padding: 6 }}>
                              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{p.name} {p.prenom}</Text>
                              <Text style={{ fontSize: 13, color: '#444' }}>{p.address}</Text>
                              <Text style={{ fontSize: 13, color: '#7B2CBF', marginTop: 2 }}>{p.price}</Text>
                              <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>Tap to view profile</Text>
                            </View>
                          </Callout>
                        </Marker>
                      ))}
                    </MapView>
                  )}
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Services</Text>
                  <TouchableOpacity onPress={() => setShowAllServices(true)}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.servicesGrid}>
                  {defaultServices.map((service, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.serviceItem}
                      onPress={() => {
                        if (service.label === "More") {
                          setShowAllServices(true);
                        } else {
                          setSelectedServiceCategory(service.label);
                        }
                      }}
                    >
                      <View style={styles.serviceIconContainer}>
                        <Image source={service.icon} style={styles.serviceIcon} />
                      </View>
                      <Text style={styles.serviceLabel}>{service.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Most Popular</Text>
                </View>

                <FlatList
                  data={popularCategories}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.popularScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.popularButton,
                        selectedPopular === item && styles.popularButtonSelected,
                      ]}
                      onPress={() => setSelectedPopular(item)}
                    >
                      <Text
                        style={[
                          styles.popularButtonText,
                          selectedPopular === item && styles.popularButtonTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {selectedPopular && filteredPopularServices.length > 0 && (
  <ServiceList2
    
    services={filteredPopularServices}
    onBack={() => setSelectedPopular("")}
    onSelectProvider={handleSelectProvider}
/>

)}

              </>
            }

            data={[]}
            renderItem={null}
          />
        )}

        {/* Modal filtre */}
        <Modal animationType="slide" transparent={true} visible={showFilter}>
          <Pressable style={styles.modalContainer} onPress={() => setShowFilter(false)}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Sort & Filter</Text>
              <View style={styles.separator} />

              <Text style={styles.modalSubTitle}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((cat, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.catBtn, selectedCategory === cat && styles.catBtnSelected]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.catText, selectedCategory === cat && styles.catTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.modalSubTitle}>Price Range</Text>
              <MultiSlider
                values={priceRange}
                sliderLength={Dimensions.get("window").width - 40}
                onValuesChange={(values) => setPriceRange(values)}
                min={0}
                max={1000}
                step={1}
                selectedStyle={{ backgroundColor: "#7B2CBF" }}
                markerStyle={{ backgroundColor: "#7B2CBF", height: 20, width: 20 }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                <Text style={styles.priceText}>${priceRange[0]}</Text>
                <Text style={styles.priceText}>${priceRange[1]}</Text>
              </View>

              <Text style={styles.modalSubTitle}>Rating</Text>
              <View style={styles.ratingContainer}>
                {ratings.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.ratingBtn, selectedRating === r && styles.ratingBtnSelected]}
                    onPress={() => setSelectedRating(r)}
                  >
                    <Text style={[styles.ratingText, selectedRating === r && styles.ratingTextSelected]}>
                      {r === "All" ? "⭐ All" : `⭐ ${r}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => {
                    setSelectedCategory("All");
                    setPriceRange([50, 1000]);
                    setSelectedRating("All");
                  }}
                >
                  <Text style={{ color: "#7B2CBF" }}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Modal plein écran carte */}
        <Modal visible={showFullMap} animationType="slide">
          <View style={{ flex: 1 }}>
            <MapView
              style={styles.fullMap}
              region={
                location
                  ? {
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                  : undefined
              }
              showsUserLocation
            >
              {fetchedServices.map((p, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: p.latitude,
                    longitude: p.longitude,
                  }}
                >
                  <Callout onPress={() => handleSelectProvider(p)}>
                    <View style={{ width: 200, padding: 6 }}>
                      <Image
                        source={p.image}
                        style={{
                          width: '100%',
                          height: 100,
                          borderRadius: 10,
                          marginBottom: 6,
                        }}
                        resizeMode="cover"
                      />
                      <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
                        {p.name} {p.prenom}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Ionicons name="location-sharp" size={14} color="#7B2CBF" style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 13, color: '#444', flexShrink: 1 }}>{p.address}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="cash-outline" size={14} color="#7B2CBF" style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 13, color: '#7B2CBF' }}>{p.price} / {p.typeTarif}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>Tap to view profile</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>

            <TouchableOpacity
              style={styles.closeMapButton}
              onPress={() => setShowFullMap(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Modal plein écran chatbot */}
<Modal animationType="slide" transparent={false} visible={chatbotVisible}>
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <SafeAreaView style={{ flex: 1,  backgroundColor: "#F4F0FB", }}>
<View style={{
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 18,
  backgroundColor: "#F4F0FB",
  borderBottomWidth: 1,
  borderColor: "#E0D7F3",
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
}}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Assistant Virtuel</Text>
        <TouchableOpacity onPress={() => setChatbotVisible(false)}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messageHistory.map((msg, index) => {
          const isUser = msg.from === clientId;
          return (
        <View
  key={index}
  style={{
    alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser ? "#5B2DCB" : "#FFFFFF",
  paddingVertical: 16,
  paddingHorizontal: 20,
  maxWidth: "80%",
  marginVertical: 8,
 
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 10,
  elevation: 7,
  borderWidth: isUser ? 0 : 1.2,
  borderColor: isUser ? "transparent" : "#E6E6E6",
  }}
>


<Text style={{ color: isUser ? "#fff" : "#2F2F2F", fontSize: 15, lineHeight: 21 }}>
  {msg.text}
</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: "row", padding: 12, borderTopWidth: 1, borderColor: "#ddd" }}>
        <TextInput
  placeholder="Écris ton message..."
  value={userMessage}
  onChangeText={setUserMessage}
  placeholderTextColor="#9CA3AF"
  style={{
     flex: 1,
  height: 54,
  backgroundColor: "#FAF8FF",
  borderColor: "#D6BCFA",
  borderWidth: 1.3,
  borderRadius: 18,
  paddingHorizontal: 18,
  fontSize: 16,
  fontWeight: "500",
  color: "#1F1F1F",
  shadowColor: "#7B2CBF",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
  }}
/>

        <TouchableOpacity
  disabled={isSending}
  onPress={async () => {
    if (!userMessage.trim() || clientId === null) return;
    setIsSending(true);
    // d’abord on envoie vers la route /intent/{id} pour voir s’il peut exécuter une action
    try {
      const intentRes = await axios.post(`http://192.168.1.5:8000/chatbot/intent/${clientId}`, {
        prompt: userMessage,

      });

      // si ça passe => on ajoute la réponse dans l’historique manuellement
      setMessageHistory((prev) => [
        ...prev,
        { from: clientId, text: userMessage },
        { from: null, text: intentRes.data.message },
      ]);
      setUserMessage("");
      setIsSending(false);
    } catch (intentErr) {
      // s’il comprend rien => fallback sur mémoire
      try {
        await axios.post(`http://192.168.1.5:8000/chatbot/memory/${clientId}`, {
          prompt: userMessage,
        });
        setUserMessage("");
        fetchHistory(clientId); // recharge l’historique
      } catch (err) {
        console.error("Erreur mémoire:", err);
      } finally {
        setIsSending(false);
      }
    }
  }}
  style={{
   backgroundColor: isSending ? "#B794F4" : "#5B2DCB",
  borderRadius: 20,
  marginLeft: 10,
  paddingVertical: 12,
  paddingHorizontal: 20,
  minWidth: 90,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#5B2DCB",
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  elevation: 6,
  borderWidth: 1.2,
  borderColor: "#E9D8FD",
}}

>
  <Text style={{ color: '#fff', fontWeight: '600' }}>
    {isSending ? "..." : "Envoyer"}
  </Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  </KeyboardAvoidingView>
</Modal>


      </SafeAreaView>
      <TouchableOpacity
  onPress={() => setChatbotVisible(true)}
  style={{
    position: "absolute",
  bottom: 26,
  right: 22,
  backgroundColor: "#5B2DCB", // Violet profond stylé
  width: 64,
  height: 64,
  borderRadius: 32,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#5B2DCB",
  shadowOpacity: 0.35,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 10,
  elevation: 10,
  borderWidth: 2,
  borderColor: "#EBDCFF", // ton pastel cohérent
  zIndex: 100,
  
  }}
>
  <Ionicons name="chatbubble-ellipses-outline" size={26} color="#fff" />
</TouchableOpacity>

    <Modal visible={classicChatbotVisible} animationType="fade" transparent>
  <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }} onPress={() => setClassicChatbotVisible(false)}>
    <Pressable style={{ width: "85%", backgroundColor: "#fff", borderRadius: 16, padding: 20 }} onPress={(e) => e.stopPropagation()}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Pose-moi une question</Text>
      <TextInput
        placeholder="Écris quelque chose..."
        value={classicInput}
        onChangeText={setClassicInput}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity
        onPress={async () => {
          try {
            const res = await axios.post("http://192.168.1.5:8000/chatbot/", { prompt: classicInput });
            setClassicResponse(res.data.result);
          } catch (e) {
            setClassicResponse("Erreur !");
          }
        }}
        style={{ backgroundColor: "#7B2CBF", padding: 12, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Envoyer</Text>
      </TouchableOpacity>
      {classicResponse !== "" && (
        <Text style={{ marginTop: 12, fontStyle: "italic", color: "#333" }}>{classicResponse}</Text>
      )}
    </Pressable>
  </Pressable>
</Modal>
    </ImageBackground>
  );

}


const styles = StyleSheet.create({
   background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
   
  },
  fullscreenWhite: {
    flex: 1,
    
  },
  allServicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
   
  },
  backIcon: {
    width: 26,
    height: 26,
    tintColor: "#333",
  },
  input: {
  flex: 1,
  fontSize: 15,
  color: "#1F2937",
  paddingVertical: 0,
  paddingHorizontal: 0,
  includeFontPadding: false,
},
iconLeft: {
  marginRight: 8,
  marginTop: 1,
},
iconRight: {
  marginLeft: 8,
  marginTop: 1,
},
  allServicesTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
    color: "#111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  greeting: {
  fontSize: 13.5,
  color: "#6B7280", // gris doux et élégant
  letterSpacing: 0.3,
},

name: {
  fontSize: 16,
  fontWeight: "700",
  color: "#1A1A1A",
  letterSpacing: 0.4,
  marginTop: 2,
},

iconsRight: {
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
},

iconSmall: {
  width: 24,
  height: 24,
  tintColor: "#4B4B4B",
  opacity: 0.9,
},

searchContainer: {
  marginTop: 20,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F9FAFB",
  borderRadius: 14,
  paddingHorizontal: 12,
  height: 54,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  width: "90%",
  marginLeft: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.03,
  shadowRadius: 3,
  elevation: 2,
},
searchInputWrapper: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F9F9FC",
  borderRadius: 20,
  paddingHorizontal: 16,
  height: 52,
  borderWidth: 1,
  borderColor: "#DADDE5",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
},

searchIconLeft: {
  width: 22,
  height: 22,
  tintColor: "#9CA3AF",
  marginRight: 10,
},

searchInput: {
  flex: 1,
  height: "100%",
  fontSize: 15,
  color: "#1F2937",
  fontWeight: "500",
  letterSpacing: 0.3,
},

 filterButton: {
  backgroundColor: "#EFEAFD", // léger fond violet pâle
  padding: 12,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#7B2CBF",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
},

searchIcon: {
  width: 24,
  height: 24,
  tintColor: "#6A0DAD", // violet profond et élégant
  opacity: 0.9,
  marginHorizontal: 2,
  resizeMode: "contain",
},


  sectionHeader: {
  marginTop: 32,
  marginBottom: 18,
  paddingHorizontal: 24,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

sectionTitle: {
  fontSize: 20,
  fontWeight: "800",
  color: "#1A1A1A",
  letterSpacing: 0.3,
  textTransform: "capitalize",
  marginTop: 5,
  
},

seeAll: {
  fontSize: 14,
  fontWeight: "600",
  color: "#7B2CBF",
  textDecorationLine: "underline",
  letterSpacing: 0.2,
  marginTop: 15,
},

 offerBanner: {
    width: screenWidth - 40,
    height: 140,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },

servicesGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  rowGap: 24,
  marginBottom: -1,
},

serviceItem: {
  width: "23%",
  alignItems: "center",
},

serviceIconContainer: {
  backgroundColor: "#FFF",
  padding: 10,
  borderRadius: 24,
  marginBottom: 8,
  shadowColor: "#7B2CBF",
  shadowOpacity: 0.06,
  shadowOffset: { width: 2, height: 7 },
  shadowRadius: 18,
  elevation: 10,
},

serviceIcon: {
  width: 42,
  height: 42,
  resizeMode: "contain",
},

serviceLabel: {
  fontSize: 13,
  fontWeight: "600",
  color: "#2C2C2E",
  textAlign: "center",
  lineHeight: 18,
},
 popularScroll: {
  paddingHorizontal: 20,
  marginBottom: 10,

},

popularButton: {
  borderWidth: 1.2,
  borderColor: "#7B2CBF",
  backgroundColor: "#F6F1FE",
  borderRadius: 28,
  paddingHorizontal: 16,
  paddingVertical: 7,
  marginRight: 12,
  shadowColor: "#7B2CBF",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
  
},

popularButtonSelected: {
  backgroundColor: "#7B2CBF",
  borderColor: "#7B2CBF",
  shadowOpacity: 0.18,
  elevation: 5,
},

popularButtonText: {
  fontSize: 15,
  fontWeight: "600",
  color: "#7B2CBF",
  letterSpacing: 0.3,
},

popularButtonTextSelected: {
  color: "#FFFFFF",
  fontWeight: "700",
},

modalContainer: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0, 0, 0, 0.45)", // profondeur + immersion
},

modalContent: {
  backgroundColor: "#FFFFFF",
  borderTopLeftRadius: 36,
  borderTopRightRadius: 36,
  paddingHorizontal: 28,
  paddingTop: 30,
  paddingBottom: 34,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 10,
},

modalTitle: {
  fontSize: 21,
  fontWeight: "800",
  color: "#1A1A1A",
  textAlign: "center",
  marginBottom: 16,
  letterSpacing: 0.6,
  textTransform: "capitalize",
},

separator: {
  borderBottomColor: "#E3D9F9",
  borderBottomWidth: 1,
  marginVertical: 20,
  opacity: 0.9,
},

modalSubTitle: {
  fontSize: 15.5,
  fontWeight: "700",
  marginBottom: 12,
  color: "#262626",
  textTransform: "uppercase",
  letterSpacing: 0.5,
},

categoryScroll: {
  marginBottom: 22,
},

catBtn: {
  borderColor: "#7B2CBF",
  borderWidth: 1.4,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 26,
  marginRight: 10,
  backgroundColor: "#F8F4FF",
  minHeight: 42,
  justifyContent: "center",
  alignItems: "center",
},

catBtnSelected: {
  backgroundColor: "#7B2CBF",
  borderColor: "#7B2CBF",
},

catText: {
  color: "#7B2CBF",
  fontSize: 14,
  fontWeight: "600",
},

catTextSelected: {
  color: "#FFFFFF",
  fontWeight: "700",
},

priceText: {
  fontSize: 14,
  color: "#3C3C3C",
  marginBottom: 8,
  fontWeight: "500",
  letterSpacing: 0.3,
},

ratingContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 14,
},

ratingBtn: {
  borderColor: "#7B2CBF",
  borderWidth: 1.2,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 24,
  backgroundColor: "#F8F4FF",
},

ratingBtnSelected: {
  backgroundColor: "#7B2CBF",
},

ratingText: {
  fontSize: 13,
  color: "#7B2CBF",
  fontWeight: "600",
},

ratingTextSelected: {
  color: "#FFFFFF",
  fontWeight: "700",
},

modalFooter: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 28,
  gap: 12,
},

resetBtn: {
  backgroundColor: "#EDE6FB",
  paddingHorizontal: 24,
  paddingVertical: 14,
  borderRadius: 28,
  shadowColor: "#7B2CBF",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 5,
  elevation: 3,
},

applyBtn: {
  backgroundColor: "#7B2CBF",
  paddingHorizontal: 28,
  paddingVertical: 14,
  borderRadius: 28,
  shadowColor: "#7B2CBF",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 5,
},

mapContainer: {
  width: screenWidth - 40,
  height: 180 ,
  borderRadius: 16,
  overflow: 'hidden',
  alignSelf: 'center',
  marginVertical: 16,
  marginBottom: 0,
},
miniMap: {
  flex: 1,
},
fullMap: {
  flex: 1,
},
closeMapButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: '#7B2CBF',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 24,
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
},
onlineDot: {
  position: "absolute",
  bottom: 0,
  right: 0,
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: "#22C55E", // vert lime
  borderWidth: 2,
  borderColor: "#fff", // pour bien contraster avec la photo
},




});
