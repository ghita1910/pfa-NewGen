import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { images } from "@/constants";

const { width } = Dimensions.get("window");

const CreateNewPassword = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const animTitle = useRef(new Animated.Value(0)).current;
  const animInputs = useRef(new Animated.Value(50)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animTitle, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.parallel([
        Animated.timing(animInputs, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <ImageBackground source={images.fondecran13} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={20} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require("@/assets/images/meak11.png")} style={styles.image} />

          <Animated.Text
            style={[
              styles.title,
              {
                opacity: animTitle,
                transform: [{ translateY: animTitle.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              },
            ]}
          >
            Create Your New Password
          </Animated.Text>

          <Animated.View style={[styles.form, { opacity: animOpacity, transform: [{ translateY: animInputs }] }]}>
            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#7B2CBF" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#aaa"
                secureTextEntry={secure1}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecure1(!secure1)}>
                <Ionicons name={secure1 ? "eye-off" : "eye"} size={20} color="#7B2CBF" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#7B2CBF" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry={secure2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setSecure2(!secure2)}>
                <Ionicons name={secure2 ? "eye-off" : "eye"} size={20} color="#7B2CBF" />
              </TouchableOpacity>
            </View>

            {/* Remember me */}
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxContainer}
              activeOpacity={0.8}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={22}
                color={rememberMe ? "#7B2CBF" : "#999"}
              />
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity style={styles.continueButton} activeOpacity={0.85}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 40,
  },
  backBtn: {
    backgroundColor: "#7B2CBF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#5A189A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E1E1E",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#e5e5e5",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: "#ccc",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginLeft: 4,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#444",
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: "#7B2CBF",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7B2CBF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
