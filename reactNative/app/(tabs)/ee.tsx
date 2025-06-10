import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
  SafeAreaView,
  Modal,
  Animated,
  ImageBackground,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "@/config";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const modalAnim = useState(new Animated.Value(0))[0];

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const fetchClient = async () => {
        try {
          const id = await AsyncStorage.getItem("client_id");
          if (!id) return;
          const apiUrl = await config.getApiUrl();
          const res = await axios.get(`${apiUrl}/home/client/${id}`);
          const { nom, prenom, email, photo } = res.data;
          setClientName(`${prenom} ${nom}`);
          setClientEmail(email);
          if (photo) setPhotoUrl(`${apiUrl}/${photo}`);
        } catch (err) {
          console.error("Erreur récupération client:", err);
        }
      };
      fetchClient();
    }, [])
  );

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeLogoutModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowLogoutModal(false));
  };

  const options = [
    { label: "Edit Profile", icon: icons.profile },
    { label: "Notification", icon: icons.notif },
    { label: "Payment", icon: icons.pay },
    { label: "Security", icon: icons.lock },
    { label: "Language", icon: icons.fil, rightLabel: "English(US)" },
    { label: "Dark Mode", icon: icons.dark, isSwitch: true },
    { label: "Privacy Policy", icon: icons.lock },
    { label: "Help Center", icon: icons.ihelp },
    { label: "Invite Friends", icon: icons.invitefriend },
    { label: "Logout", icon: icons.out, isLogout: true },
  ];

  return (
     <ImageBackground
                      source={images.fondecran4}
                      style={styles.background}
                      resizeMode="cover"
                    >
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="person-circle-outline" size={34} color="#7B2CBF" />
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={27} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <View style={styles.imageContainer}>
            <Image source={photoUrl ? { uri: photoUrl } : images.prof} style={styles.profilePhoto} />
            <TouchableOpacity
              style={styles.editPhoto}
              onPress={() => router.push("/pages/EditProfileClient")}
            >
              <Feather name="edit-3" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{clientName}</Text>
          <Text style={styles.email}>{clientEmail}</Text>
        </View>

        <View style={styles.optionsSection}>
          {options.map((item, index) => (
            <View key={index}>
              {item.isSwitch ? (
                <View style={styles.optionRow}>
                  <View style={styles.leftRow}>
                    <Image source={item.icon} style={styles.optionIcon} />
                    <Text style={styles.optionLabel}>{item.label}</Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#DADADA", true: "#7B2CBF" }}
                    thumbColor={darkMode ? "#ffffff" : "#f1f1f1"}
                  />
                </View>
              ) : item.isLogout ? (
                <TouchableOpacity style={styles.optionRow} onPress={openLogoutModal}>
                  <View style={styles.leftRow}>
                    <Image source={item.icon} style={[styles.optionIcon, { tintColor: "red" }]} />
                    <Text style={styles.logoutText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    if (item.label === "Language") router.push("/pages/LanguageScreen");
                    else if (item.label === "Payment") router.push("/pages/MyPaymentMethodsScreen");
                    else if (item.label === "Privacy Policy") router.push("/pages/PrivacyPolicyScreen");
                    else if (item.label === "Help Center") router.push("/pages/HelpCenterScreen");
                    else if (item.label === "Notification") router.push("/pages/NotificationScreen");
                    else if (item.label === "Edit Profile") router.push("/pages/EditProfileClient");
                  }}
                >
                  <View style={styles.leftRow}>
                    <Image source={item.icon} style={styles.optionIcon} />
                    <Text style={styles.optionLabel}>{item.label}</Text>
                  </View>
                  {item.rightLabel ? (
                    <Text style={styles.rightText}>{item.rightLabel}</Text>
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#1C1C1E" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal transparent visible={showLogoutModal} animationType="fade">
        <Animated.View style={[styles.modalOverlay, { opacity: modalAnim }]}>
          <View style={styles.modalBox}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Logout</Text>
            <View style={styles.separator} />
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeLogoutModal} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={async () => {
                  await AsyncStorage.removeItem("access_token");
                  await AsyncStorage.removeItem("client_id");
                  router.replace("/(auth)/signinoptions");
                }}
              >
                <Text style={styles.logoutButtonText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
   background: {
    flex: 1,
  },
  safeArea: { flex: 1, },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1C1C1E" },
  centerContent: { alignItems: "center", marginVertical: 26 },
  imageContainer: { position: "relative" },
  profilePhoto: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  editPhoto: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7B2CBF",
    borderRadius: 999,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 20, fontWeight: "700", color: "#1C1C1E", marginTop: 10 },
  email: { fontSize: 14, color: "#777777", marginTop: 2 },
  optionsSection: {
    borderTopWidth: 1,
    borderColor: "#E8E8E8",
    marginTop: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  leftRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  optionIcon: { width: 22, height: 22, tintColor: "#1C1C1E" },
  optionLabel: { fontSize: 16, fontWeight: "500", color: "#1C1C1E" },
  rightText: { color: "#7B2CBF", fontSize: 14, fontWeight: "500" },
  logoutText: { fontSize: 16, fontWeight: "600", color: "red" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 4,
  },
  modalBox: {
    backgroundColor: "#F9FAFB",
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 28,
    paddingBottom: 40,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 30,
  },
  dragHandle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 19.5,
    fontWeight: "800",
    color: "#DC2626",
    marginBottom: 6,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 18,
  },
  modalMessage: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 26,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E0E7FF",
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: "center",
  },
  cancelText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
