import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants"; // Assurez-vous que ce fichier contient tes icônes et images

const SignIn = () => {
  
  const router = useRouter();

  const handleForgotPassword = () => {
    router.push("/(auth)/forgotpassword"); // Remplacez par le chemin de la page Forgot Password
  };

  return (
    <ImageBackground
   
      style={styles.background}
      resizeMode="cover"
    >

        


      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hello, {"\n"}Sign in!</Text>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="Enter Your Email"
            icon={icons.email}
          />

          <InputField
            label="Password"
            placeholder="Password"
            secureTextEntry
            icon={icons.lock}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Sign In"
              onPress={() => router.push("/(auth)/signup")}
              bgVariant="primary"
              textVariant="default"
              style={styles.signInGradient}
            />

<TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

          </View>

          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={icons.google} style={styles.socialIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image source={icons.insta} style={styles.socialIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image source={icons.facebook} style={styles.socialIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image source={icons.X} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.signUpText}>
          Don’t have an account? {" "}
          <Text
            style={styles.signUpLink}
            onPress={() => router.push("/(auth)/signup")}
          >
            Sign up
          </Text>
        </Text>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    left:15,
    color: "black",
    textAlign: "left",
    marginTop: 50,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  signInGradient: {
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#E2E8F0",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  socialButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
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
