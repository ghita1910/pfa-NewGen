import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Animated,
  Easing,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

const VerifyCode = () => {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(53);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<TextInput[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const startShake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 3, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleVerify = () => {
    const finalCode = code.join("");
    if (finalCode.length < 4) {
      startShake();
      return;
    }
    router.push("/(auth)/createnewpassword");
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(53);
    }
  };

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (text !== "" && index < 3) {
        inputs.current[index + 1].focus();
      }
      if (text === "" && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  return (
    <ImageBackground source={images.fondecran13} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={20} color="#fff" />
        </TouchableOpacity>

        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Animatable.Image
            animation="fadeInDown"
            duration={1000}
            delay={100}
            source={images.meak1}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>Code has been sent to your phone number</Text>

          <Animated.View style={[styles.codeContainer, { transform: [{ translateX: shakeAnim }] }]}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputs.current[index] = el!)}
                style={styles.codeBox}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </Animated.View>

          <Text style={styles.timerText}>Resend code in {timer}s</Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendButton}>Resend Code</Text>
          </TouchableOpacity>

          <CustomButton
            title={loading ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            style={styles.verifyButton}
            disabled={loading}
          />
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  illustration: {
    width: "100%",
    height: 200,
    alignSelf: "center",
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
    fontSize: 32,
    fontWeight: "700",
    color: "#35155D",
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
    gap: 14,
    marginBottom: 30,
  },
  codeBox: {
    width: 56,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#7B2CBF",
    backgroundColor: "#FFF",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#35155D",
    shadowColor: "#7B2CBF",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  timerText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  resendButton: {
    fontSize: 16,
    color: "#7B2CBF",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#7B2CBF",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7B2CBF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 10,
  },
});
