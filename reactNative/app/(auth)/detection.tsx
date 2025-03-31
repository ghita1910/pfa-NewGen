import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { icons } from "@/constants";

const SelectRoleScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Role</Text>
      </View>

      {/* Role Cards */}
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(auth)/signinclient")}
        >
          {icons.person && (
            <Image source={icons.person} style={styles.cardIcon} resizeMode="contain" />
          )}
          <Text style={styles.cardTitle}>Customer</Text>
          <View style={styles.separator} />
          <Text style={styles.cardDescription}>
            As a Customer, you can:{"\n"}
            - Book services{"\n"}
            - Manage your bookings{"\n"}
            - Rate service providers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(auth)/signupprovider")}
        >
          {icons.person && (
            <Image source={icons.person} style={styles.cardIcon} resizeMode="contain" />
          )}
          <Text style={styles.cardTitle}>Service Provider</Text>
          <View style={styles.separator} />
          <Text style={styles.cardDescription}>
            As a Service Provider, you can:{"\n"}
            - Offer services{"\n"}
            - Manage earnings{"\n"}
            - Interact with customers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {icons.param && (
          <Image source={icons.check1} style={styles.footerIcon} resizeMode="contain" />
        )}
        <Text style={styles.footerText}>
          The role you choose will determine your experience on the platform. Please choose carefully.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SelectRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#1F2937",
    borderRadius: 24,
    padding: 8,
    marginRight: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardIcon: {
    width: 48,
    height: 48,
    alignSelf: "center",
    marginBottom: 14,
   
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },
  separator: {
    height: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
    borderRadius: 100,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerIcon: {
    width: 26,
    height: 26,
    marginBottom: 8,
  
  },
  footerText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});
