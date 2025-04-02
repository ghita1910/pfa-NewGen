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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter,useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Svg, { Path } from "react-native-svg";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";

const SignUp = () => {
  const router = useRouter();
  const [usePhone, setUsePhone] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.removeItem('signupData');  // Supprime tout à chaque retour
    }, [])
  );

  const handleSignUp = async () => {
    if (!agreeTerms || !agreeMarketing) {
      setShowModal(true);
      return;
    }

    await AsyncStorage.setItem('signupData', JSON.stringify({
      email: usePhone ? null : emailOrPhone,
      tel: usePhone ? emailOrPhone : null,
      password: password,
    }));

    router.push("/(auth)/detection");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={images.tourn} style={styles.illustration} resizeMode="contain" />
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create a new account</Text>

          <TouchableOpacity onPress={() => setUsePhone(!usePhone)} style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {usePhone ? "Use Email instead" : "Use Phone Number instead"}
            </Text>
          </TouchableOpacity>

          <InputField
            label={usePhone ? "Phone Number" : "Email"}
            placeholder={usePhone ? "Enter phone number" : "Enter email"}
            keyboardType={usePhone ? "phone-pad" : "email-address"}
            icon={usePhone ? icons.chat : icons.email}
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
          />

          <InputField label="Password" placeholder="Password" secureTextEntry icon={icons.lock} value={password} onChangeText={setPassword} />
          <InputField label="Confirm Password" placeholder="Confirm Password" secureTextEntry icon={icons.lock} value={confirmPassword} onChangeText={setConfirmPassword} />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)}>
            <View style={[styles.checkbox, agreeTerms && styles.checked]} />
            <Text style={styles.checkboxText}>
              I accept the <Text style={styles.linkText}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeMarketing(!agreeMarketing)}>
            <View style={[styles.checkbox, agreeMarketing && styles.checked]} />
            <Text style={styles.checkboxText}>Send me promotional offers & updates</Text>
          </TouchableOpacity>

          <CustomButton title="Next" onPress={handleSignUp} style={styles.button} />
        </ScrollView>
        <Modal transparent visible={showModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Please accept terms and conditions</Text>
              <CustomButton title="OK" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "# D3D3D3",
  },
  container: {
    flex: 1,
  },
  illustration: {
    width: "100%",
    height: 200,
    alignSelf: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
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
    textDecorationLine: "underline",
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
    color: "#3B82F6",
    fontWeight: "600",
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
    borderColor: "#CBD5E1",
    marginRight: 12,
  },
  checked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkboxText: {
    flex: 1,
    color: "#374151",
    fontSize: 14.5,
    fontWeight: "500",
  },
  linkText: {
    color: "#3B82F6",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 20,
    width: "80%",
  },
  loginTextContainer: {
    marginTop: 16,
  },
  loginText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
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
    backgroundColor: "#E0F2FE",
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
  signUpText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#475569",
  },
  signUpLink: {
    color: "#0284C7",
    fontWeight: "bold",
  },
  
});
