import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { icons, images } from "@/constants";
import BookingCard from "@/components/componentClient/BookingCard";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
  try {
      const clientId = await AsyncStorage.getItem("client_id");
      if (!clientId) return;

      const res = await axios.get(
        `http://192.168.1.5:8000/home/client-demandes?client_id=${clientId}`
      );

      const data = res.data.map((d: any) => ({
        image: { uri: `http://192.168.1.5:8000/${d.photo}` },
        title: `${d.prestataire_nom} ${d.prestataire_prenom}`,
        name: `${d.username}`,
        status: capitalizeStatus(d.etat),
        date: d.Date,
        time: d.heure,
        address: d.adresse,
        description: d.description,
        prestataireID: d.prestataireID,
        montant: d.montant,
        id: d.demandeServiceID,
      }));

      setAllBookings(data);
    } catch (err) {
      console.error("Erreur récupération bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchBookings();
  }, []);


  
  const capitalizeStatus = (etat: string) => {
    switch (etat) {
      case "started":
        return "Pending";
      case "completed":
        return "Completed";
      case "canceled":
        return "Cancelled";
      default:
        return etat.charAt(0).toUpperCase() + etat.slice(1);
    }
  };

  const filteredBookings = allBookings.filter((b) => b.status === activeTab);

  return (
     <ImageBackground
                      source={images.fondecran4}
                      style={styles.background}
                      resizeMode="cover"
                    >
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar-outline" size={26} color="#7B2CBF" style={styles.headerIcon} />
          <Text style={styles.title}>My Bookings</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={20} color="#1C1C1E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#1C1C1E" />
          </TouchableOpacity>
        </View>
      </View>

     <View style={styles.tabs}>
  {["Pending", "Completed", "Cancelled"].map((tab) => (
    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
      {activeTab === tab && <View style={styles.tabUnderline} />}
    </TouchableOpacity>
  ))}
</View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#7B2CBF" style={{ marginTop: 40 }} />
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((item, index) => (
           <BookingCard
    key={index}
    service={item}
    refreshBookings={fetchBookings} // 👈 Pass here
    onMessagePress={() =>
      router.push({
        pathname: "../pages/ChatScreen",
        params: {
          receiver_id: item.prestataireID, // ou item.prestataireID selon ta data
          receiver_name: item.title,
          receiver_photo: item.image.uri.replace("http://192.168.1.5:8000/", ""),
        },
      })
    }
  />
          ))
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              No bookings in the "{activeTab}" tab yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
    flex: 1,
  },
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22},  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerIcon: { marginRight: 12 },
title: { fontSize: 24, fontWeight: "800", color: "#1C1C1E", letterSpacing: 0.4 },  iconRow: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 },
  iconBtn: {
    backgroundColor: "#EFE5FF", borderRadius: 32, padding: 10,
    shadowColor: "#7B2CBF", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6, elevation: 3,
  },
  tabButton: {
  flex: 1,
  alignItems: "center",
  paddingVertical: 10,
},  tabText: {
  fontSize: 16,
  color: "#444",
  fontWeight: "600",
},
activeTab: {
  color: "#7B2CBF",
  fontWeight: "700",
},
tabUnderline: {
  marginTop: 6,
  height: 3.5,
  width: 36,
  backgroundColor: "#7B2CBF",
  borderRadius: 10,
},  scrollContent: { paddingBottom: 40, paddingTop: 10 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginTop: 24, marginBottom: 20, paddingHorizontal: 16 },
  tabBtn: { alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 22, backgroundColor: "rgba(123, 44, 191, 0.05)" },
  activeTabText: { color: "#7B2CBF", fontWeight: "700" },
 
  placeholder: { marginTop: 60, alignItems: "center", paddingHorizontal: 24 },
  placeholderText: { fontSize: 15, color: "#6B7280", fontStyle: "italic", textAlign: "center", lineHeight: 22, letterSpacing: 0.2 },
});
