import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants"; // 🎯 Tu dois avoir les icônes (Facebook, Google, Apple...)

const SignInOptions = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <Image source={images.peint2} style={styles.illustration} resizeMode="contain" />

      {/* Title */}
      <Text style={styles.title}>Let’s you in</Text>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={icons.arrowDown} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={icons.google} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={icons.home} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Sign in with Password */}
      <CustomButton
        title="Sign in with password"
        onPress={() => router.push("/(auth)/signup")}
        style={styles.signInButton}
        bgVariant="primary"
        textVariant="default"
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInOptions;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF",
      padding: 20,
      justifyContent: "space-between",
    },
    backIcon: {
      marginTop: 10,
    },
    backText: {
      fontSize: 24,
      color: "#111",
    },
    illustration: {
      width: "100%",
      height: 200,
      alignSelf: "center",
      marginBottom: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#111",
      textAlign: "center",
      marginVertical: 10,
    },
    socialContainer: {
      gap: 15,
      marginTop: 10,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F3F4F6",
      borderRadius: 12,
      padding: 14,
      paddingHorizontal: 20,
    },
    socialIcon: {
      width: 22,
      height: 22,
      marginRight: 16,
      resizeMode: "contain",
    },
    socialText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111",
    },
    separatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: "#E5E7EB",
    },
    separatorText: {
      marginHorizontal: 10,
      fontSize: 14,
      color: "#6B7280",
    },
    signInButton: {
      width: "100%",
      marginBottom: 20,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 15,
    },
    footerText: {
      color: "#6B7280",
      fontSize: 14,
    },
    signUpLink: {
      color: "#7C3AED",
      fontWeight: "bold",
      fontSize: 14,
    },
  });
  