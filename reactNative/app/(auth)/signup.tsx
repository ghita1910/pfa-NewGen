import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../config";

const SignUp = () => {
  const router = useRouter();
  const [usePhone, setUsePhone] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  const handleSignUp = async () => {
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirmPassword("");

    if (!agreeTerms) {
      setShowModal(true);
      return;
    }

    if (!emailOrPhone || !password || !confirmPassword) {
      if (!emailOrPhone) setErrorEmail("Ce champ est requis.");
      if (!password) setErrorPassword("Ce champ est requis.");
      if (!confirmPassword) setErrorConfirmPassword("Ce champ est requis.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirmPassword("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const apiUrl = await config.getApiUrl();
      const payload = usePhone ? { tel: emailOrPhone } : { email: emailOrPhone };

      await axios.post(apiUrl + "/auth/check", payload);

      const signupData = {
        ...(usePhone ? { tel: emailOrPhone } : { email: emailOrPhone }),
        password: password,
      };

      await AsyncStorage.setItem("signupData", JSON.stringify(signupData));
      router.push("/(auth)/detection");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const detail = error.response.data.detail;
        if (detail.toLowerCase().includes("email")) {
          setErrorEmail(detail);
        } else if (detail.toLowerCase().includes("téléphone")) {
          setErrorEmail(detail);
        }
      } else {
        setErrorEmail("Erreur inattendue.");
        console.error("❌ Axios error:", error);
      }
    }
  };

  return (
  <ImageBackground
                   source={images.fondecran13}
                   style={styles.background}
                   resizeMode="cover"
                 >
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
        <Animatable.Image
  animation="fadeInDown"
  duration={1000}
  delay={100}
  source={images.meak1}
  style={styles.illustration}
  resizeMode="contain"
/>

          <Animatable.View
  animation="fadeInUp"
  duration={1200}
  delay={200}
  style={styles.innerContainer}
>


            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create a new account</Text>

            <TouchableOpacity
              onPress={() => setUsePhone(!usePhone)}
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                {usePhone ? "Use Email instead" : "Use Phone Number instead"}
              </Text>
            </TouchableOpacity>

           <InputField
  label={usePhone ? "Phone Number" : "Email"}
  placeholder={`Enter ${usePhone ? "phone number" : "email"}`}
  keyboardType={usePhone ? "phone-pad" : "email-address"}
  iconComponent={
    usePhone
      ? <Ionicons name="call-outline" size={22} color="#7B2CBF" />
      : <Ionicons name="mail-outline" size={22} color="#7B2CBF" />
  }
  value={emailOrPhone}
  onChangeText={(text) => {
    setEmailOrPhone(text);
    setErrorEmail("");
  }}
/>

            {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

            <View style={styles.passwordContainer}>
              <InputField
                label="Password"
                placeholder="Enter Password"
                secureTextEntry={!showPassword}
                iconComponent={<Ionicons name="lock-closed-outline" size={22} color="#7B2CBF" />
}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorPassword("");
                }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
            {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

            <View style={styles.passwordContainer}>
              <InputField
                label="Confirm Password"
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                iconComponent={<Ionicons name="lock-closed-outline" size={22}  color="#7B2CBF" />}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrorConfirmPassword("");
                }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
            {errorConfirmPassword ? <Text style={styles.errorText}>{errorConfirmPassword}</Text> : null}

            <TouchableOpacity
  style={styles.checkboxContainer}
  onPress={() => setAgreeTerms(!agreeTerms)}
  activeOpacity={0.8}
>
  <View style={[styles.checkbox, agreeTerms && styles.checked]}>
    {agreeTerms && (
      <Ionicons name="checkmark-sharp" size={16} color="#fff" />
    )}
  </View>
  <Text style={styles.checkboxText}>
    I accept the{" "}
    <Text
      style={styles.linkText}
      onPress={() => router.push("/pages/PrivacyPolicyScreen")}
    >
      Terms & Conditions
    </Text>
  </Text>
</TouchableOpacity>


            <CustomButton title="Next" onPress={handleSignUp} style={styles.button} />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/signin")}
              style={styles.loginTextContainer}
            >
              <Text style={styles.signUpText}>
                Already have an account? <Text style={styles.signUpLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </Animatable.View>

        </ScrollView>

        {/* Modal pour les conditions */}
        <Modal
          transparent
          visible={showModal}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
             <View style={styles.iconWrapper}>
  <Ionicons name="home-outline" size={36} color="#7B2CBF" />
</View>

              <Text style={styles.modalTitle}>
                Please accept terms and conditions
              </Text>
              <Text style={styles.modalMessage}>
                It is compulsory you accept our terms and conditions before we
                get you started on our app
              </Text>
              <CustomButton
                title="OK"
                onPress={() => setShowModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ImageBackground>  
  );
};

export default SignUp;

const styles = StyleSheet.create({
  // (styles remain unchanged...)
  errorText: {
    color: "red",
    marginBottom: 8,
    marginTop: -8,
    fontSize: 13,
    alignSelf: "flex-start",
  },
  background:{
    flex: 1,
  },

  safeArea: {
    flex: 1,
   
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  illustration: {
    width: "100%",
    height: 200,
    alignSelf: "center",
  },
  innerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
  },
  toggleContainer: {
    marginVertical: 10,
  },
  toggleText: {
    fontSize: 14,
    color: "#7B2CBF",
    fontWeight: "600",
  },
  passwordContainer: {
    width: "100%",
    marginTop: 16,
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 52, // ajuste cette valeur si nécessaire
    zIndex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "black",
    marginRight: 12,
  },
  checked: {
    backgroundColor: "#7B2CBF",
    borderColor: "#7B2CBF",
  },
  checkboxText: {
    flex: 1,
    color: "#374151",
    fontSize: 14.5,
    fontWeight: "500",
  },
  linkText: {
    color: "#7B2CBF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 20,
    width: "80%",
    shadowColor: "#7B2CBF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 10,
  },
  loginTextContainer: {
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#475569",
  },
  signUpLink: {
    color: "#7B2CBF",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#7B2CBF",
    borderRadius: 24,
    padding: 8,
    marginRight: 340,
    marginLeft: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  iconWrapper: {
   backgroundColor: "#F3E8FF",

    padding: 12,
    borderRadius: 50,
    marginBottom: 12,
  },
  modalIcon: {
    width: 36,
    height: 36,
    tintColor: "#0284C7",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    marginTop: 10,
  },
});
