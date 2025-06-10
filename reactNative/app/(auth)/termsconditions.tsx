import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TermsAndConditions = () => {
  const router = useRouter();

  const handleAccept = () => {
   // router.push("/(auth)/provider-register");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Flèche retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={22} color="#1E3A8A" />
      </TouchableOpacity>

      {/* ✅ En-tête */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subtitle}>For Service Providers</Text>
      </View>

      {/* ✅ Contenu scrollable */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            By using our platform, you agree to comply with our provider policy,
            quality standards, and communication guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Payments & Fees</Text>
          <Text style={styles.sectionText}>
            Payments are processed weekly. A service fee of 10% is deducted from
            each transaction. Details are visible in your wallet.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Cancellation Policy</Text>
          <Text style={styles.sectionText}>
            Cancellations must be made 12 hours in advance. Frequent cancellations
            may lead to penalties or temporary suspension.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Code of Conduct</Text>
          <Text style={styles.sectionText}>
            Respect clients. Harassment, fraud, or unethical behavior is not
            tolerated and may result in account deactivation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Updates</Text>
          <Text style={styles.sectionText}>
            Terms may be updated from time to time. You’ll be notified in-app and
            continued use implies acceptance of any changes.
          </Text>
        </View>

        {/* ✅ Bouton d'acceptation */}
        <CustomButton
          title="I Agree & Continue"
          onPress={handleAccept}
          bgVariant="primary"
          textVariant="default"
          style={styles.acceptButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  backButton: {
    position: "absolute",
    top: 140,
    left: 20,
    zIndex: 10,
    backgroundColor: "#F0F4FF", // fond bleuté doux pour rappeler l’interface
    padding: 10,
    borderRadius: 50, // cercle parfait
    shadowColor: "#1E40AF", // ombre bleue légère
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB", // fine bordure grise
  },
  
  headerContainer: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#E3E9F2",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2D3748",
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#718096",
    textAlign: "center",
    marginTop: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E4E8F3",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1A202C",
    letterSpacing: 0.8,
  },
  sectionText: {
    fontSize: 17,
    color: "#4A5568",
    lineHeight: 26,
    textAlign: "justify",
  },
  acceptButton: {
    marginTop: 25,
    borderRadius: 35,
    width: "85%",
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
});
