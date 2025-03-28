import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton"; // Votre bouton personnalisé

const VerifyCode = () => {
  const [code, setCode] = useState(""); // Code saisi par l'utilisateur
  const [timer, setTimer] = useState(53); // Timer pour le code
  const [isVerified, setIsVerified] = useState(false); // Vérification du code
  const [loading, setLoading] = useState(false); // Charger l'état du bouton

  // Démarrer le timer au chargement de la page
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000); // Met à jour chaque seconde

    return () => clearInterval(interval); // Nettoie l'intervalle lorsque le composant est démonté
  }, [timer]);

  // Vérification du code
  const handleVerify = () => {
    if (code === "7458") {
      setIsVerified(true);
      Alert.alert("Success", "Code Verified Successfully!");
    } else {
      Alert.alert("Error", "Invalid verification code.");
    }
  };

  // Gestion de la demande de nouveau code
  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(53); // Redémarre le compteur
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Code has been sent to +1 111 *****99
        </Text>

        {/* Code input */}
        <View style={styles.codeContainer}>
          <TouchableOpacity
            style={styles.codeButton}
            onPress={() => setCode(code + "7")}
          >
            <Text style={styles.codeButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.codeButton}
            onPress={() => setCode(code + "4")}
          >
            <Text style={styles.codeButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.codeButton}
            onPress={() => setCode(code + "5")}
          >
            <Text style={styles.codeButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.codeButton}
            onPress={() => setCode(code + "8")}
          >
            <Text style={styles.codeButtonText}>8</Text>
          </TouchableOpacity>
        </View>

        {/* Timer */}
        <Text style={styles.timerText}>Resend code in {timer} s</Text>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendButton}>Resend Code</Text>
        </TouchableOpacity>

        {/* Vérifier le code */}
        <CustomButton
          title={loading ? "Verifying..." : "Verify"}
          onPress={handleVerify}
          style={styles.verifyButton}
          disabled={loading} // Désactive le bouton pendant la vérification
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  codeButton: {
    width: 60,
    height: 60,
    backgroundColor: "#4f56b3", // Boutons avec couleur attrayante
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 12,
  },
  codeButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  timerText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  resendButton: {
    fontSize: 16,
    color: "#4f56b3",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#4f56b3", // Bouton vert pour la vérification
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VerifyCode;
