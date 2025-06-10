import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { icons, images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { AntDesign, Ionicons } from '@expo/vector-icons';

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
     <ImageBackground
                    source={images.fondecran13}
                    style={styles.background}
                    resizeMode="cover"
                  >
    <SafeAreaView style={styles.safeArea}>
       <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                 <AntDesign name="arrowleft" size={20} color="#fff" />
               </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={images.meak1} style={styles.illustration} />
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
  placeholder={viaEmail ? "example@email.com" : "+212 6 12 34 56 78"}
  value={viaEmail ? email : phone}
  onChangeText={(text) => (viaEmail ? setEmail(text) : setPhone(text))}
  keyboardType={viaEmail ? "email-address" : "phone-pad"}
  iconComponent={
    viaEmail ? (
      <Ionicons name="mail-unread-outline" size={22} color="#7B2CBF" />
    ) : (
      <Ionicons name="call-sharp" size={22} color="#7B2CBF" />
    )
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
    </ImageBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    
  },
  safeArea: {
    flex: 1,
   
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
   backBtn: {
    backgroundColor: "#7B2CBF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#5A189A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    position: "absolute",
    top: 55,
    left: 18,
    zIndex: 10,
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
    borderColor:"rgba(163, 119, 245, 0.28)",
   backgroundColor: "rgba(163, 119, 245, 0.28)",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
    tintColor: "#7B2CBF",
  },
  optionText: {
    fontSize: 18,
    color: "#1f2937",
    fontWeight: "600",
  },
  continueButton: {
    marginTop: 30,
    width: "80%",
    backgroundColor: "#7B2CBF",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    
   shadowColor: "#7B2CBF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 10,
  },
  inputWrapper: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  sendButton: {
    marginTop: 15,
    width: "80%",
    backgroundColor: "#7B2CBF",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    
   shadowColor: "#7B2CBF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 10,
  },
  backButton: {
    backgroundColor: "#7B2CBF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#5A189A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    position: "absolute",
    top: 55,
    left: 18,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#3b82f6",
  },
});
