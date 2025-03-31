// SignInOptions.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";

const SignInOptions = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <Image source={images.tourn} style={styles.illustration} resizeMode="contain" />

      {/* Title */}
      <Text style={styles.title}>Let's you in</Text>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={icons.facebook} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={icons.google} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={icons.apple} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* OR Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.line} />
      </View>

      <CustomButton
        title="Sign in with password"
        onPress={() => router.push("/(auth)/signin")}
        style={styles.signInButton}
        
        textVariant="default"
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signUpLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: " # D3D3D3",
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: "space-between",
  },
  backIcon: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 26,
    color: "#4B0082", // Indigo
  },
  illustration: {
    width: "100%",
    height: 200,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3F3D56",
    marginVertical: 24,
  },
  socialContainer: {
    gap: 16,
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    resizeMode: "contain",
  },
  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E1B4B",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 3,
    backgroundColor: "#E5E7EB",
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  signInButton: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 20,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  signUpLink: {
    color: "#0286FF", // Indigo-Violet
    fontWeight: "bold",
    fontSize: 14,
  },
});
