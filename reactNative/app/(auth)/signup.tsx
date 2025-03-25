import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons } from "@/constants";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SignUp = () => {
  const router = useRouter();
  const [usePhone, setUsePhone] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const toggleContactMethod = () => {
    LayoutAnimation.easeInEaseOut();
    setUsePhone(!usePhone);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create a new account</Text>

          {/* First & Last Name */}
          <View style={styles.row}>
            <View style={[styles.flexOne, { marginRight: 10 }]}>
              <InputField
                label="First Name"
                placeholder="First Name"
                icon={icons.person}
              />
            </View>
            <View style={styles.flexOne}>
              <InputField
                label="Last Name"
                placeholder="Last Name"
                icon={icons.person}
              />
            </View>
          </View>

          {/* Toggle Email / Phone */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {usePhone ? "Use Email instead" : "Use Phone Number  instead"}
            </Text>
            <TouchableOpacity onPress={toggleContactMethod}>
              <Text style={styles.toggleButton}>
                {usePhone ? "Switch to Email" : "Switch to Phone"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conditional Field */}
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

          {/* Passwords */}
          <InputField
            label="Password"
            placeholder="Password"
            secureTextEntry
            icon={icons.lock}
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm Password"
            secureTextEntry
            icon={icons.lock}
          />

          {/* Checkboxes */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checked]} />
            <Text style={styles.checkboxText}>
              I accept the{" "}
              <Text style={styles.linkText}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeMarketing(!agreeMarketing)}
          >
            <View style={[styles.checkbox, agreeMarketing && styles.checked]} />
            <Text style={styles.checkboxText}>
              Send me promotional offers & updates
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <CustomButton
            title="Sign Up"
            onPress={() => console.log("Sign Up")}
            style={styles.button}
          />

          {/* Already have an account */}
          <TouchableOpacity
            style={styles.loginTextContainer}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.loginText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexOne: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  toggleButton: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#FFF",
  },
  checked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkboxText: {
    flex: 1,
    color: "#374151",
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: "500",
  },
  linkText: {
    color: "#3B82F6",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 50,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginTextContainer: {
    alignItems: "center",
    marginTop: 16,
    paddingBottom: 30,
  },
  loginText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
  },
});
