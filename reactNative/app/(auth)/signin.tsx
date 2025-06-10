import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import config from "../../config";
import { AntDesign } from "@expo/vector-icons";

const SignIn = () => {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");

  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(20)).current;
  const iconsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(subtitleAnim, {
          toValue: 0,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
      ]),
      Animated.timing(iconsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  }, []);

  const handleForgotPassword = () => {
    router.push("./forgotpassword");
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!emailOrPhone || !password) {
      setErrorMessage("Les deux champs sont requis.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{8,15}$/;

    if (!usePhone && !emailRegex.test(emailOrPhone)) {
      setErrorMessage("Veuillez entrer un email valide.");
      setIsLoading(false);
      return;
    }

    if (usePhone && !phoneRegex.test(emailOrPhone)) {
      setErrorMessage("Veuillez entrer un numéro de téléphone valide.");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = await config.getApiUrl();
      const response = await axios.post("http://192.168.1.5:8000/auth/signin", {
        [usePhone ? "phone" : "email"]: emailOrPhone,
        password: password,
      });

      const { access_token, utilisateurID, role } = response.data;

      if (access_token) {
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("client_id", utilisateurID.toString());

        if (role === "customer") {
          router.push("/(tabs)/oo");
        } else if (role === "prestataire") {
          router.push("/(tabsprestataire)/HomeScreen");
        } else {
          setErrorMessage("Rôle inconnu.");
        }
      } else {
        setErrorMessage("Token d'accès manquant dans la réponse");
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as any;
      if (err && err.response && err.response.data) {
        setErrorMessage(err.response.data.detail || "Erreur inconnue");
      } else {
        setErrorMessage("Erreur de connexion");
      }
    }
  };

  return (
    <ImageBackground source={images.fondecran13} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={20} color="#fff" />
        </TouchableOpacity>

        <Animated.Text style={[styles.title, { opacity: titleAnim }]}>Hello,</Animated.Text>
        <Animated.Text style={[styles.subtitle, { transform: [{ translateY: subtitleAnim }] }]}>
          Sign in!
        </Animated.Text>

        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => setUsePhone(!usePhone)} style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {usePhone ? "Use Email instead" : "Use Phone Number instead"}
            </Text>
          </TouchableOpacity>

          <InputField
            label={usePhone ? "Phone Number" : "Email"}
            placeholder={`Enter ${usePhone ? "phone number" : "email"}`}
            keyboardType={usePhone ? "phone-pad" : "email-address"}
            iconComponent={
              usePhone ? (
                <Ionicons name="call-outline" size={22} color="#7B2CBF" />
              ) : (
                <Ionicons name="mail-outline" size={22} color="#7B2CBF" />
              )
            }
            value={emailOrPhone}
            onChangeText={(text) => {
              setEmailOrPhone(text);
                setErrorEmail("");
              }}
              />

              <View>
              <InputField
                label="Password"
                placeholder="Enter Password"
                secureTextEntry={!showPassword}
                iconComponent={
                <Ionicons name="lock-closed-outline" size={22} color="#7B2CBF" />
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

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <View style={styles.buttonContainer}>
            <CustomButton
              title={"Sign In"}
              onPress={handleSignIn}
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

          <Animated.View style={[styles.socialContainer, { opacity: iconsAnim }]}>
            {[icons.google, icons.insta, icons.facebook, icons.X].map((icon, index) => (
              <TouchableOpacity key={index} style={styles.socialButton} activeOpacity={0.8}>
                <Image source={icon} style={styles.socialIcon} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>

        <Text style={styles.signUpText}>
          Don’t have an account?
          <Text style={styles.signUpLink} onPress={() => router.push("/(auth)/signup")}>
            {" "}
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
  toggleContainer: {
    marginVertical: 10,
  },
  toggleText: {
    fontSize: 14,
    color: "#7B2CBF",
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
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
    fontSize: 46,
    fontWeight: "bold",
    color: "#7B2CBF",
    marginTop: 110,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#7B2CBF",
    marginBottom: 30,
    textAlign: "left",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
   eyeIcon: {
    position: "absolute",
    right: 12,
    top: 52, // ajuste cette valeur si nécessaire
    zIndex: 1,
  },
  signInGradient: {
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#7B2CBF",
    shadowColor: "#7B2CBF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#7B2CBF",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
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
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 10,
    gap: 12,
  },
  socialButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#ccc",
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
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
});
