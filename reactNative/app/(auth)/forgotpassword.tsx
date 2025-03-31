import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { icons, images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";

const ForgotPassword = () => {
  const router = useRouter();
  const [viaSMS, setViaSMS] = useState(false);
  const [viaEmail, setViaEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleContinue = () => {
    if (!viaSMS && !viaEmail) {
      Alert.alert("Error", "Please select a contact option!");
      return;
    }
    setShowInput(true);
  };

  const handleSendCode = () => {
    router.push("/(auth)/sentverification");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={icons.backArrow} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={images.tourn} style={styles.illustration} />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Select which contact details should we use to reset your password
        </Text>

        {/* Choix de la méthode */}
        <TouchableOpacity
          style={[styles.optionContainer, viaSMS && styles.selectedOption]}
          onPress={() => {
            setViaSMS(true);
            setViaEmail(false);
            setShowInput(false);
          }}
        >
          <View style={styles.optionContent}>
            <Image source={icons.email} style={styles.optionIcon} />
            <Text style={styles.optionText}>via SMS</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionContainer, viaEmail && styles.selectedOption]}
          onPress={() => {
            setViaEmail(true);
            setViaSMS(false);
            setShowInput(false);
          }}
        >
          <View style={styles.optionContent}>
            <Image source={icons.email} style={styles.optionIcon} />
            <Text style={styles.optionText}>via Email</Text>
          </View>
        </TouchableOpacity>

        {/* Affichage du champ de saisie */}
        {!showInput ? (
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            bgVariant="primary"
            textVariant="default"
            style={styles.continueButton}
          />
        ) : (
          <View style={styles.inputWrapper}>
            <InputField
              label={viaEmail ? "Enter your email" : "Enter your phone number"}
              icon={viaEmail ? icons.email : icons.chat}
              keyboardType={viaEmail ? "email-address" : "phone-pad"}
              placeholder={viaEmail ? "example@email.com" : "+212 6 12 34 56 78"}
              value={viaEmail ? email : phone}
              onChangeText={(text) =>
                viaEmail ? setEmail(text) : setPhone(text)
              }
            />

            <CustomButton
              title={loading ? "Sending..." : "Send Code"}
              onPress={handleSendCode}
              bgVariant="primary"
              textVariant="default"
              style={styles.sendButton}
              disabled={loading}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f9",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 60,
  },
  illustration: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
  },
  optionContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  selectedOption: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
    tintColor: "#3b82f6",
  },
  optionText: {
    fontSize: 18,
    color: "#1f2937",
    fontWeight: "600",
  },
  continueButton: {
    marginTop: 30,
    width: "80%",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  inputWrapper: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  sendButton: {
    marginTop: 15,
    width: "80%",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#3b82f6",
  },
});
