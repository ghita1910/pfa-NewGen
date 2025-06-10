// SelectRoleScreen.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectRoleScreen = () => {
  const router = useRouter();

  const selectRole = async (role: string, path: string) => {
    const storedData = await AsyncStorage.getItem("signupData");
    const data = storedData ? JSON.parse(storedData) : {};
    data.role = role;
    await AsyncStorage.setItem("signupData", JSON.stringify(data));
    console.log("Role set:", data.role);
    router.push(path);
  };

  return (
    <ImageBackground
      source={images.fondecran13}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Role</Text>
        </View>

        <View style={styles.cardWrapper}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, styles.customerCard]}
            onPress={() => selectRole("customer", "/(auth)/signinclient")}
          >
            <Ionicons name="people" size={54} color="#6D28D9" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Customer</Text>
            <View style={styles.separator} />
            <Text style={styles.cardDescription}>
              Explore worldwide services{"\n"}Book, manage & rate your providers.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, styles.providerCard]}
            onPress={() => selectRole("prestataire", "/(auth)/signupprovider")}
          >
            <FontAwesome5 name="hands-helping" size={52} color="#16A34A" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Service Provider</Text>
            <View style={styles.separator} />
            <Text style={styles.cardDescription}>
              Share your skills globally{"\n"}Gain clients, grow your income.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={20} color="#7C3AED" />
          <Text style={styles.footerText}>
            Your role shapes your global experience.{"\n"}
            Choose with ambition and purpose.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SelectRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 24,
    padding: 8,
    marginRight: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginLeft: -24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1E293B",
    flexShrink: 1,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: 30,
    padding: 34,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderWidth: 1.8,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 14,
  },
  customerCard: {
    borderColor: "#7C3AED",
  },
  providerCard: {
    borderColor: "#16A34A",
  },
  cardIcon: {
    alignSelf: "center",
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },
  separator: {
    height: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
    borderRadius: 50,
  },
  cardDescription: {
    fontSize: 15.5,
    lineHeight: 22,
    color: "#374151",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 13.5,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});
