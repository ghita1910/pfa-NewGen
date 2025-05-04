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
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  const router = useRouter();
  const [usePhone, setUsePhone] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    if (!agreeTerms) {
      setShowModal(true);
      return;
    }
    console.log("Sign Up logic...");
    router.push("/(tabs)/oo");
  };

  return (
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
          <Image
            source={images.tourn}
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.innerContainer}>
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

            {usePhone ? (
              <InputField
                label="Phone Number"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                icon={icons.chat}
              />
            ) : (
              <InputField
                label="Email"
                placeholder="Enter email"
                keyboardType="email-address"
                icon={icons.email}
              />
            )}

            {/* Password Field */}
            <View style={styles.passwordContainer}>
              <InputField
                label="Password"
                placeholder="Enter Password"
                secureTextEntry={!showPassword}
                icon={icons.lock}
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

            {/* Confirm Password Field */}
            <View style={styles.passwordContainer}>
              <InputField
                label="Confirm Password"
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                icon={icons.lock}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checked]} />
              <Text style={styles.checkboxText}>
                I accept the{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => router.push("./termsconditions")}
                >
                  Terms & Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeMarketing(!agreeMarketing)}
            >
              {/* Optional marketing agreement */}
            </TouchableOpacity>

            <CustomButton
              title="Next"
              onPress={handleSignUp}
              style={styles.button}
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/signin")}
              style={styles.loginTextContainer}
            >
              <Text style={styles.signUpText}>
                Already have an account?{" "}
                <Text style={styles.signUpLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal */}
        <Modal
          transparent
          visible={showModal}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.iconWrapper}>
                <Image source={icons.home} style={styles.modalIcon} />
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
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    color: "#3B82F6",
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
  backButton: {
    backgroundColor: "#1F2937",
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
});
