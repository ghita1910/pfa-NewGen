import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants"; // Ajoutez vos icônes et images modernes ici

const ForgotPassword = () => {
  const [viaSMS, setViaSMS] = useState(false);
  const [viaEmail, setViaEmail] = useState(false);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const handleContinue = () => {
    if (!viaSMS && !viaEmail) {
      Alert.alert("Error", "Please select a contact option!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "We have sent you a password reset link!");
    }, 2000); // Simulation du temps de traitement
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Illustration */}
        <Image source={images.tourn} style={styles.illustration} />

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Select which contact details should we use to reset your password
        </Text>

        {/* Option 1: SMS */}
        <TouchableOpacity
          style={[styles.optionContainer, viaSMS && styles.selectedOption]}
          onPress={() => {
            setViaSMS(!viaSMS);
            setViaEmail(false); // Désactiver l'option Email si SMS est sélectionné
          }}
        >
          <View style={styles.optionContent}>
            <Image source={icons.email} style={styles.optionIcon} />
            <Text style={styles.optionText}>via SMS:</Text>
          </View>
          <Text style={styles.optionValue}>+1 111 *****99</Text>
        </TouchableOpacity>

        {/* Option 2: Email */}
        <TouchableOpacity
          style={[styles.optionContainer, viaEmail && styles.selectedOption]}
          onPress={() => {
            setViaEmail(!viaEmail);
            setViaSMS(false); // Désactiver l'option SMS si Email est sélectionné
          }}
        >
          <View style={styles.optionContent}>
            <Image source={icons.email} style={styles.optionIcon} />
            <Text style={styles.optionText}>via Email:</Text>
          </View>
          <Text style={styles.optionValue}>and**ley@yourdomain.com</Text>
        </TouchableOpacity>

        {/* Continue Button with loading state */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={loading} // Désactiver le bouton pendant le chargement
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Couleur de fond moderne
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  illustration: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 30,
    borderRadius: 15, // Bordure arrondie de l'image pour un look plus moderne
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Poppins", // Utilisation d'une police moderne
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  optionContainer: {
    width: "100%",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff", // Fond blanc
    shadowColor: "#000", // Ombre pour l'effet de profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Ombre pour les appareils Android
  },
  selectedOption: {
    borderColor: "#4f56b3", // Surbrillance bleue
    backgroundColor: "#e0e6ff", // Fond léger pour les options sélectionnées
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Poppins", // Police moderne pour le texte
  },
  optionValue: {
    fontSize: 14,
    color: "#777",
  },
  continueButton: {
    backgroundColor: "#4f56b3", // Bouton bleu
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    elevation: 4, // Ombre pour le bouton
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ForgotPassword;
