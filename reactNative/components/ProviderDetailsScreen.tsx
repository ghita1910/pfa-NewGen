import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const screenHeight = Dimensions.get("window").height;

export default function ProviderDetailsScreen({ provider, onBack }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <Animatable.Image
          animation="fadeIn"
          delay={100}
          duration={600}
          source={provider.image}
          style={styles.image}
        />

        <Animatable.View animation="fadeInUp" delay={200} style={styles.infoSection}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.role}>{provider.role}</Text>
          <Text style={styles.price}>{provider.price}</Text>

          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {provider.rating} | {provider.reviews} Reviews
            </Text>
          </View>

          <View style={styles.addressContainer}>
            <FontAwesome name="map-marker" size={18} color="#7B2CBF" />
            <Text style={styles.addressText}>
              {provider.address || "Unknown location"}
            </Text>
          </View>

          <Text style={styles.aboutTitle}>About Me</Text>
          <Text style={styles.description}>
            I’m a highly experienced specialist in {provider.role.toLowerCase()}, committed to delivering outstanding results with professionalism and care. Your satisfaction is my priority.
          </Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.buttonRow}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        </Animatable.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    minHeight: screenHeight,
  },
  backButton: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 30,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0A1F3A",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7B2CBF",
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addressText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 8,
    color: "#0A1F3A",
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  messageButton: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    backgroundColor: "#F1EAFE",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookButton: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    backgroundColor: "#7B2CBF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  messageText: {
    color: "#7B2CBF",
    fontWeight: "700",
    fontSize: 16,
  },
});
