import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";  // Import AsyncStorage

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons } from "@/constants"; // Assurez-vous que ce fichier contient tes icônes et images
import config from "../../config";

const SignIn = () => {
  
  const router = useRouter();

  const handleForgotPassword = () => {
    router.push("./forgotpassword"); 
  };
  // États pour les champs du formulaire
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(""); // Réinitialiser les erreurs
  
    // Validation
    if (!emailOrPhone || !password) {
      setErrorMessage("Les deux champs sont requis.");
      setIsLoading(false);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailOrPhone)) {
      setErrorMessage("Veuillez entrer un email valide.");
      setIsLoading(false);
      return;
    }
  
    try {
      const apiUrl = await config.getApiUrl();  // Récupérer l'URL dynamique
      console.log('URL utilisée:', apiUrl);
      

      console.log("Envoi de la demande de connexion...");

      const response = await axios.post(apiUrl+"/auth/signin", {
        email: emailOrPhone,
        password: password,
      });
  
      console.log("Réponse du serveur:", response.status);
      console.log("Données de la réponse:", response.data);
  
      // Vérifie si `access_token` est dans la réponse
      if (response.data.access_token) {
        const { access_token } = response.data;
  
        // Enregistrer le token JWT dans AsyncStorage
        await AsyncStorage.setItem("access_token", access_token);
        // Rediriger l'utilisateur vers une autre page après connexion réussie
        router.push("/(auth)/signinoptions");
      } else {
        setErrorMessage("Token d'accès manquant dans la réponse");
      }
    } catch (error) {
      console.log("Erreur lors de la connexion:", error);
      setIsLoading(false);
      const err = error as any;
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.detail || "Erreur inconnue");
      } else {
        setErrorMessage("Erreur de connexion");
      }
    }
  };
  

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hello, {"\n"}Sign in!</Text>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <InputField
            label="Email or Phone"
            placeholder="Enter Your Email or Phone"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            icon={icons.email} // Tu peux mettre un icône adapté pour email ou téléphone
          />

          <InputField
            label="Password"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            icon={icons.lock}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

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

          {/* Séparateur et social login */}
          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>or continue with</Text>
            <View style={styles.line} />
          </View>
        </View>

        <Text style={styles.signUpText}>
          Don’t have an account?{" "}
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
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007AFF",
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
    height: 1.5,
    backgroundColor: "#E2E8F0",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#6B7280",
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
