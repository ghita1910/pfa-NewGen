import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { icons } from "@/constants";

const screenWidth = Dimensions.get("window").width;

const categories = ["All", "Cleaning", "Painting", "Laundry", "Appliance", "Plumbing", "Shifting", "Repairing", "Massage"];
const ratings = ["All", "5", "4", "3", "2", "1"];

interface ServiceItem {
  name: string;
  role: string;
  price: string;
  rating: string;
  reviews: string;
  image: any;
  address: string; // 👈 ajout
}
interface Props {
  title: string;
  services: ServiceItem[];
  onBack: () => void;
  onSelectProvider: (provider: ServiceItem) => void;
}


interface Props {
  title: string;
  services: ServiceItem[];
  onBack: () => void;
}

export default function ServiceList({ title, services, onBack, onSelectProvider }: Props) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedRating, setSelectedRating] = useState("All");

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FlatList
        data={isSearching ? filteredServices : services}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                  <AntDesign name="arrowleft" size={22} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
              </View>
              <TouchableOpacity style={styles.searchBtn} onPress={() => setIsSearching(true)}>
                <AntDesign name="search1" size={22} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {isSearching && (
              <View style={styles.searchBar}>
                <AntDesign name="search1" size={20} color="#999" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search"
                  placeholderTextColor="#999"
                  style={styles.searchInput}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                <TouchableOpacity onPress={() => setShowFilter(true)}>
                  <Image source={icons.fil} style={styles.filterIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        ListFooterComponent={<View style={{ height: 40 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectProvider(item)} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <View style={styles.addressRow}>
  <FontAwesome name="map-marker" size={14} color="#7B2CBF" style={{ marginRight: 6 }} />
  <Text style={styles.address}>{item.address}</Text>
</View>

              <Text style={styles.price}>{item.price}</Text>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={14} color="#FFA500" />
                <Text style={styles.ratingText}>  {item.rating} | {item.reviews} Reviews</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bookmarkBtn}>
            <FontAwesome name="save" size={22} color="#7B2CBF" />

            </TouchableOpacity>
          </TouchableOpacity>
        )}
        
      />

      {/* Modal: Filter */}
      <Modal animationType="slide" transparent={true} visible={showFilter}>
        <Pressable style={styles.modalContainer} onPress={() => setShowFilter(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Sort & Filter</Text>
            <View style={styles.separator} />

            {/* Category Filter */}
            <Text style={styles.modalSubTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.catBtn, selectedCategory === cat && styles.catBtnSelected]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catText, selectedCategory === cat && styles.catTextSelected]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Price Filter */}
            <Text style={styles.modalSubTitle}>Price Range</Text>
            <MultiSlider
              values={priceRange}
              sliderLength={screenWidth - 40}
              onValuesChange={setPriceRange}
              min={0}
              max={1000}
              step={1}
              selectedStyle={{ backgroundColor: "#7B2CBF" }}
              markerStyle={{ backgroundColor: "#7B2CBF", height: 20, width: 20 }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: screenWidth - 64, marginVertical: 10 }}>
              <Text style={styles.priceText}>${priceRange[0]}</Text>
              <Text style={styles.priceText}>${priceRange[1]}</Text>
            </View>

            {/* Rating Filter */}
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

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedCategory("All");
                  setPriceRange([100, 500]);
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
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  listContainer: { paddingBottom: 30, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#1a1a1a" },
  backBtn: { backgroundColor: "#F1F1F1", padding: 10, borderRadius: 14 },
  searchBtn: { backgroundColor: "#F1F1F1", padding: 10, borderRadius: 14 },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F5F5", borderRadius: 16,
    paddingHorizontal: 12, marginHorizontal: 16,
    height: 48, marginBottom: 16,
  },
  searchInput: { flex: 1, height: 45, fontSize: 14, color: "#333" },
  filterIcon: { width: 20, height: 20, tintColor: "#7B2CBF" },

  card: {
    flexDirection: "row", backgroundColor: "#FFFFFF",
    borderRadius: 28, padding: 24, marginBottom: 20, marginHorizontal: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: "#F0F0F0",
  },
  image: {
    width: 80, height: 80, borderRadius: 20,
    resizeMode: "cover", borderWidth: 1, borderColor: "#E0E0E0",
  },
  info: { flex: 1, marginLeft: 20 },
  name: { fontSize: 17, fontWeight: "700", color: "#121212", marginBottom: 4 },
  role: { fontSize: 15, fontWeight: "700", color: "#333", marginBottom: 6 },
  price: { fontSize: 16, fontWeight: "700", color: "#7B2CBF", marginBottom: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 13, color: "#666", marginLeft: 6 },
  bookmarkBtn: { paddingLeft: 12 },

  modalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: {
    backgroundColor: "#fff", borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  separator: { width: "100%", borderBottomColor: "#ddd", borderBottomWidth: 1.5, marginVertical: 15 },
  modalSubTitle: { fontSize: 15, fontWeight: "600", marginBottom: 10, color: "#222" },
  categoryScroll: { marginBottom: 15 },
  catBtn: { borderColor: "#7B2CBF", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 24, marginRight: 10 },
  catBtnSelected: { backgroundColor: "#7B2CBF" },
  catText: { color: "#7B2CBF", fontSize: 14 },
  catTextSelected: { color: "#fff" },
  priceText: { fontSize: 13, color: "#333" },
  ratingContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 },
  ratingBtn: { borderColor: "#7B2CBF", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 24 },
  ratingBtnSelected: { backgroundColor: "#7B2CBF" },
  ratingTextSelected: { color: "#fff", fontWeight: "600" },
  modalFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 25 },
  resetBtn: { backgroundColor: "#F1EAFE", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  applyBtn: { backgroundColor: "#7B2CBF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
 
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  address: {
    fontSize: 13,
    color: "#666",
    flexShrink: 1,
  },

});
