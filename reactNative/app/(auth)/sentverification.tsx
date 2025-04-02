import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

const VerifyCode = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(53);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    
      router.push("/(auth)/createnewpassword"); // 🔁 redirection vers la page souhaitée
    }

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(53);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={icons.backArrow} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Code has been sent to your phone number</Text>

        {/* ✅ Input via clavier */}
        <TextInput
          style={styles.codeInput}
          keyboardType="numeric"
          maxLength={4}
          value={code}
          onChangeText={setCode}
          placeholder="____"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.timerText}>Resend code in {timer} s</Text>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendButton}>Resend Code</Text>
        </TouchableOpacity>

        <CustomButton
          title={loading ? "Verifying..." : "Verify"}
          onPress={handleVerify}
          style={styles.verifyButton}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerifyCode;

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
  codeInput: {
    width: "60%",
    height: 60,
    fontSize: 28,
    textAlign: "center",
    letterSpacing: 16,
    borderBottomWidth: 2,
    borderColor: "#4f56b3",
    marginBottom: 30,
    color: "#333",
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
    backgroundColor: "#4f56b3",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#2563EB",
  },
});
