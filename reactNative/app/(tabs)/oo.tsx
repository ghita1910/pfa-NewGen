// app/(tabs)/HomeScreen.tsx
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
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { icons, images } from "@/constants";
import ServiceList from "@/components/ServiceList";
import ProviderDetailsScreen from "@/components/ProviderDetailsScreen";

const screenWidth = Dimensions.get("window").width;

const allServices = [
  { label: "Cleaning", icon: icons.clll },
  { label: "Repairing", icon: icons.clemol },
  { label: "Painting", icon: icons.paintt },
  { label: "Laundry", icon: icons.launn },
  { label: "Appliance", icon: icons.mart },
  { label: "Plumbing", icon: icons.plumb },
  { label: "Shifting", icon: icons.shift },
  { label: "Beauty", icon: icons.beau },
  { label: "AC Repair", icon: icons.acr },
  { label: "Vehicle", icon: icons.voitrep },
  { label: "Electronics", icon: icons.elecrep },
  { label: "Massage", icon: icons.mass },
  { label: "Men’s Salon", icon: icons.email },
];

const defaultServices = allServices.slice(0, 7).concat({ label: "More", icon: icons.mor });

const popularCategories = [
  "All", "Cleaning", "Painting", "Laundry", "Appliance",
  "Plumbing", "Shifting", "Repairing", "Massage"
];

const categories = [...popularCategories, "Beauty", "Vehicle"];
const ratings = ["All", "5", "4", "3", "2", "1"];

const serviceData: { [key: string]: any[] } = {
  Cleaning: [{ name: "Emma Johnson", role: "Home Cleaning", price: "$45", rating: "4.5", reviews: "6,842", image: images.prof ,address: "33 Lotissement Al Qods, Fès"}],
  Repairing: [{ name: "Emma Johnson", role: "Repairing", price: "$45", rating: "4.5", reviews: "6,842", image: images.prof,address: "6 Rue Allal Ben Abdellah, Tanger" }],
  Appliance: [{ name: "Emma Johnson", role: "Appliance Repair", price: "$45", rating: "4.5", reviews: "6,842", image: images.prof,address: "15 Quartier Administratif, Oujda" }],
  Plumbing: [{ name: "Emma Johnson", role: "Plumbing", price: "$45", rating: "4.5", reviews: "6,842", image: images.prof,address: "21 Rue de Fès, Agadir" }],
  Shifting: [{ name: "Emma Johnson", role: "Shifting", price: "$45", rating: "4.5", reviews: "6,842", image: images.prof ,address: "89 Avenue Mohamed V, Marrakech"}],
  Painting: [
    { name: "Emily Johnson", role: "Home Painting", price: "$320", rating: "4.2", reviews: "3,256", image: images.prof,address: "47 Boulevard Zerktouni, Casablanca" },
    { name: "Marca Lopez", role: "Home Painting", price: "$320", rating: "4.2", reviews: "3,256", image: images.prof,address: "12 Rue Ibnou Sina, Rabat" },
    { name: "Emma Johnson", role: "Home Painting", price: "$45", rating: "4.5", reviews: "6,842", image: images.prof , address: "123 Main St, Casablanca"},
  ],
};

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [selectedPopular, setSelectedPopular] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([50, 1000]);
  const [selectedRating, setSelectedRating] = useState("All");

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

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: (selectedServiceCategory || showAllServices || selectedProvider)
        ? { display: "none" }
        : defaultTabBarStyle
    });
  }, [selectedServiceCategory, showAllServices, selectedProvider]);

  if (selectedProvider) {
    return <ProviderDetailsScreen provider={selectedProvider} onBack={() => setSelectedProvider(null)} />;
  }

  if (selectedServiceCategory) {
    return (
      <ServiceList
        title={selectedServiceCategory}
        services={serviceData[selectedServiceCategory] || []}
        onBack={() => setSelectedServiceCategory(null)}
        onSelectProvider={setSelectedProvider}
      />
    );
  }


  return (
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
                    <Image source={images.prof} style={styles.profileImage} />
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.greeting}>Good Morning 👋</Text>
                    <Text style={styles.name}>Andrew Ainsley</Text>
                  </View>
                </View>
                <View style={styles.iconsRight}>
                  <TouchableOpacity>
                    <Image source={icons.notif} style={styles.iconSmall} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image source={icons.enrr} style={styles.iconSmall} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                  <Image source={icons.search} style={styles.searchIconLeft} />
                  <TextInput placeholder="Search" placeholderTextColor="#999" style={styles.searchInput} />
                </View>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowFilter(true)}
                >
                  <Image source={icons.fil} style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Services</Text>
              <Text style={styles.seeAll}>See All</Text>
              </View>

              <Image source={icons.serv4} style={styles.offerBanner} />

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
                    onPress={() =>
                      service.label === "More"
                        ? setShowAllServices(true)
                        : setSelectedServiceCategory(service.label)
                    }
                  >
                    <View style={styles.serviceIconContainer}>
                      <Image source={service.icon} style={styles.serviceIcon} />
                    </View>
                    <Text style={styles.serviceLabel}>{service.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Most Popular </Text>
              <Text style={styles.seeAll}>See All</Text>
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
            </>
          }
          data={[]}
          renderItem={null}
        />
      )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fullscreenWhite: {
    flex: 1,
    backgroundColor: "#fff",
  },
  allServicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  backIcon: {
    width: 26,
    height: 26,
    tintColor: "#333",
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
    fontSize: 13,
    color: "#666",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  iconsRight: {
    flexDirection: "row",
    gap: 15,
  },
  iconSmall: {
    width: 22,
    height: 22,
    tintColor: "#444",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  searchIconLeft: {
    width: 20,
    height: 20,
    tintColor: "#aaa",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 14,
    color: "#333",
  },
  filterButton: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#7B2CBF",
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7B2CBF",
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
    rowGap: 22,
  },
  serviceItem: {
    width: "22%",
    alignItems: "center",
  },
  serviceIconContainer: {
    backgroundColor: "#F6F7F8",
    padding: 14,
    borderRadius: 20,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceIcon: {
    width: 30,
    height: 30,
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  popularScroll: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  popularButton: {
    borderWidth: 1,
    borderColor: "#7B2CBF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  popularButtonSelected: {
    backgroundColor: "#7B2CBF",
  },
  popularButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7B2CBF",
  },
  popularButtonTextSelected: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
  },
  separator: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  modalSubTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#222",
  },
  categoryScroll: {
    marginBottom: 15,
  },
  catBtn: {
    borderColor: "#7B2CBF",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
    marginRight: 10,
  },
  catBtnSelected: {
    backgroundColor: "#7B2CBF",
  },
  catText: {
    color: "#7B2CBF",
    fontSize: 14,
  },
  catTextSelected: {
    color: "#fff",
  },
  priceText: {
    fontSize: 13,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
  ratingBtn: {
    borderColor: "#7B2CBF",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
  },
  ratingBtnSelected: {
    backgroundColor: "#7B2CBF",
  },
  ratingText: {
    fontSize: 13,
    color: "#7B2CBF",
  },
  ratingTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  resetBtn: {
    backgroundColor: "#F1EAFE",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  applyBtn: {
    backgroundColor: "#7B2CBF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
});
