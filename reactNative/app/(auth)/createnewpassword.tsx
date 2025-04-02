import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ pour navigation

const CreateNewPassword = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔙 Flèche de retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#2563EB" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* IMAGE */}
        <Image
          source={require("@/assets/images/new.jpeg")}
          style={styles.image}
        />

        {/* TITLE */}
        <Text style={styles.title}>Create Your New Password</Text>

        {/* INPUT 1 */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#999"
            secureTextEntry={secure1}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure1(!secure1)}>
            <Ionicons name={secure1 ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* INPUT 2 */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={secure2}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setSecure2(!secure2)}>
            <Ionicons name={secure2 ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* CUSTOM CHECKBOX */}
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkboxContainer}>
          <Ionicons
            name={rememberMe ? "checkbox" : "square-outline"}
            size={22}
            color={rememberMe ? "#0286FF" : "#999"}
          />
          <Text style={styles.checkboxLabel}> Remember me</Text>
        </TouchableOpacity>

        {/* BUTTON */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80, // pour laisser la place à la flèche
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
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
    marginBottom: 25,
    alignSelf: "flex-start",
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#444",
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#0286FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
