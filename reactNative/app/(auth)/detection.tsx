import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { icons } from "@/constants"; // assure-toi d'avoir tes icônes

const SelectRoleScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Role</Text>
      </View>

      {/* Roles */}
      <View style={styles.cardContainer}>
        {/* Customer */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(auth)/sign-up?role=customer")}
        >
          <Image source={icons.person} style={styles.icon} />
          <Text style={styles.cardTitle}>Customer</Text>
          <View style={styles.separator} />
          <Text style={styles.descriptionText}>
            As a Customer, you can:{"\n"}- Book services{"\n"}- Manage your bookings{"\n"}- Rate service providers
          </Text>
        </TouchableOpacity>

        {/* Service Provider */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(auth)/sign-up?role=provider")}
        >
          <Image source={icons.person} style={styles.icon} />
          <Text style={styles.cardTitle}>Service Provider</Text>
          <View style={styles.separator} />
          <Text style={styles.descriptionText}>
            As a Service Provider, you can:{"\n"}- Offer services{"\n"}- Manage bookings and earnings{"\n"}- Interact with customers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Image source={icons.person} style={styles.footerIcon} />
        <Text style={styles.footerText}>
          The role you choose will determine the services and features available to you.
          Your experience will be customized based on your selection...
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SelectRoleScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F8FA",
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    backIcon: {
      marginRight: 10,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#111",
    },
    cardContainer: {
      flex: 1,
      justifyContent: "center",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 20,
      marginBottom: 25,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    icon: {
      width: 40,
      height: 40,
      alignSelf: "center",
      marginBottom: 10,
      tintColor: "#0286FF",
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 10,
      color: "#111",
    },
    separator: {
      height: 1,
      backgroundColor: "#E5E7EB",
      marginVertical: 10,
    },
    descriptionText: {
      color: "#6B7280",
      fontSize: 14,
      lineHeight: 22,
      textAlign: "left",
    },
    footer: {
      alignItems: "center",
      marginTop: 10,
    },
    footerIcon: {
      width: 24,
      height: 24,
      marginBottom: 8,
      tintColor: "#9CA3AF",
    },
    footerText: {
      fontSize: 12,
      color: "#6B7280",
      textAlign: "center",
      paddingHorizontal: 10,
    },
  });
  