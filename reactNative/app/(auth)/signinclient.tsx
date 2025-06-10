import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Alert,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField2 from "@/components/InputField2"; // ajoute cette importation

import axios from "axios";

import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import config from "../../config";

const UserProfile = () => {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(images.defaultProf);
  const [imageUri, setImageUri] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    address: "",
    age: "",
  });

  // ✅ Charger les infos depuis Google
  useEffect(() => {
    const loadFromGoogle = async () => {
      try {
        const stored = await AsyncStorage.getItem("signupData");
        const parsed = stored ? JSON.parse(stored) : {};

        if (parsed.displayName) {
          const parts = parsed.displayName.split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        }

        if (parsed.photoURL) {
          setProfileImage({ uri: parsed.photoURL });
          setImageUri(parsed.photoURL);
        }
      } catch (err) {
        console.warn("Erreur chargement Google :", err);
      }
    };

    loadFromGoogle();
  }, []);

  useEffect(() => {
    let filledFields = [username, firstName, lastName, address, gender, age].filter(Boolean).length;
    Animated.timing(progress, {
      toValue: (filledFields / 6) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [username, firstName, lastName, address, gender, age]);

  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    }

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setProfileImage({ uri });
      setImageUri(uri);
    }

    setShowImagePicker(false);
  };

  const deleteImage = () => {
    setProfileImage(images.defaultProf);
    setImageUri("");
    setShowImagePicker(false);
  };

  const validateFields = () => {
    const newErrors: any = {};
    if (!username) newErrors.username = "Le nom d'utilisateur est requis";
    if (!firstName) newErrors.firstName = "Le prénom est requis";
    if (!lastName) newErrors.lastName = "Le nom est requis";
    if (!address) newErrors.address = "L'adresse est requise";
    if (!age) newErrors.age = "L'âge est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateFields()) return;

    try {
      setIsSubmitting(true);
      const storedData = await AsyncStorage.getItem("signupData");
      if (!storedData) throw new Error("Aucune donnée trouvée");

      const parsed = JSON.parse(storedData);
      const formData = new FormData();

      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("photo", {
          uri: imageUri,
          type: `image/${fileType}`,
          name: `photo.${fileType}`,
        } as any);
      }

      formData.append("email", parsed.email || "");
      formData.append("tel", parsed.tel || "");
      formData.append("password", parsed.password || ""); // vide si Google
      formData.append("role", parsed.role);
      formData.append("nom", firstName);
      formData.append("prenom", lastName);
      formData.append("username", username);
      formData.append("adresse", address);

      if (latitude !== null) formData.append("latitude", latitude.toString());
      if (longitude !== null) formData.append("longitude", longitude.toString());

      formData.append("age", age);
      formData.append("gender", gender);

      const apiUrl = await config.getApiUrl();
      const response = await axios.post(apiUrl + "/auth/signup-client", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Erreur", "Erreur inconnue lors de l'inscription");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const msg = error?.response?.data?.detail || "Erreur inattendue.";
      Alert.alert("Erreur", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <ImageBackground
             source={images.fondecran13}
             style={styles.background}
             resizeMode="cover"
           >
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardAvoiding}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fill Your Profile</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => setShowImagePicker(true)}>
              <Image source={profileImage} style={styles.profileImage} />
              <View style={styles.cameraIcon}>
                <Image source={icons.cam} style={styles.cameraIconImage} />
              </View>
            </TouchableOpacity>
          </View>

       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
  <View style={{ flex: 0.48 }}>
   <InputField2
  label="First Name"
  placeholder="Enter first name"
  value={firstName}
  onChangeText={setFirstName}
  iconComponent={<Ionicons name="person-outline" size={20} color="#7B2CBF" />}
/>
    {errors.firstName !== "" && (
      <Text style={styles.errorText}>{errors.firstName}</Text>
    )}
  </View>

  <View style={{ flex: 0.48 }}>
   <InputField2
  label="Last Name"
  placeholder="Enter Last name"
  value={lastName}
  onChangeText={setLastName}
  iconComponent={<Ionicons name="person-outline" size={20} color="#7B2CBF" />}
/>
    {errors.lastName !== "" && (
      <Text style={styles.errorText}>{errors.lastName}</Text>
    )}
  </View>
</View>



<InputField
  label="Username"
  placeholder="Enter username"
  value={username}
  onChangeText={setUsername}
 iconComponent={<Ionicons name="person-outline" size={20} color="#7B2CBF" />}
/>
{errors.username !== "" && (
  <Text style={styles.errorText}>{errors.username}</Text>
)}
          <InputField
            label="Address"
            placeholder="Tap to auto-fill or type manually"
            value={address}
            onChangeText={setAddress}
            iconComponent={<Ionicons name="location-outline" size={22} color="#7B2CBF" />
}
          />
          <TouchableOpacity
            onPress={async () => {
              try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                  Alert.alert("Permission denied", "Location permission is required.");
                  return;
                }

                const location = await Location.getCurrentPositionAsync({});
                const [place] = await Location.reverseGeocodeAsync({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });

                if (place) {
                  const fullAddress = `${place.city || place.region || ""}, ${place.name || ""}, ${place.street || ""}`;
                  setAddress(fullAddress);
                  setLatitude(location.coords.latitude);
                  setLongitude(location.coords.longitude);
                } else {
                  Alert.alert("Error", "Could not fetch address.");
                }
              } catch (err) {
                console.error("Location error:", err);
                Alert.alert("Error", "An error occurred while fetching location.");
              }
            }}
            style={{ marginBottom: 10 }}
          >
           <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 6 }}>
  <Ionicons name="earth" size={20} color="#7B2CBF" />
  <Text style={{ color: "#7B2CBF", fontWeight: "600", marginLeft: 6 }}>
    Use Current Location
  </Text>
</View>
          </TouchableOpacity>
          {errors.address !== "" && <Text style={styles.errorText}>{errors.address}</Text>}

          <InputField label="Age" placeholder="Enter age" value={age} onChangeText={setAge}  iconComponent={<Ionicons name="calendar-outline" size={22} color="#7B2CBF" />} keyboardType="numeric" />
          {errors.age !== "" && <Text style={styles.errorText}>{errors.age}</Text>}

          <Text style={styles.genderText}>Gender</Text>
          <View style={styles.genderContainer}>
            {["Male", "Female"].map((item) => (
              <TouchableOpacity key={item} style={[styles.genderOption, gender === item && styles.genderSelected]} onPress={() => setGender(item)}>
                <Text style={[styles.genderText, gender === item && styles.genderSelectedText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.progressText}>Profile Completion</Text>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          <CustomButton title={isSubmitting ? "Submitting..." : "Save Profile"} onPress={handleSaveProfile} style={styles.saveButton} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent visible={showImagePicker} animationType="fade" onRequestClose={() => setShowImagePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <CustomButton title="Use Camera" onPress={() => pickImage("camera")} style={styles.modalButton} />
            <CustomButton title="Use Gallery" onPress={() => pickImage("gallery")} style={styles.modalButton} />
            <CustomButton title="Delete Image" onPress={deleteImage} style={styles.deleteButton} />
            <CustomButton title="Cancel" onPress={() => setShowImagePicker(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showSuccessModal} animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🎉 Congratulations</Text>
            <Text style={styles.modalMessage}>Votre compte a été créé avec succès.</Text>
            <CustomButton
              title="OK"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/signin"); // ✅ Redirection vers la page de connexion
              }}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
   background:{
    flex: 1,
  },
  container: {
    flex: 1,
   
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  backButton: {
    backgroundColor: "#7B2CBF",
    borderRadius: 26,
    padding: 8,
    marginRight: 12,
    elevation: 4,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#7B2CBF",
    marginBottom: 15,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    left: 72,
    backgroundColor: "#7B2CBF",
    padding: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 3,
  },
  cameraIconImage: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
 genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
   genderOption: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#7B2CBF",
    width: "45%",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  genderSelected: {
    backgroundColor: "#7B2CBF",
    borderColor: "#7B2CBF",
  },
  genderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7B2CBF",
  },
  genderSelectedText: {
    color: "#FFFFFF",
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    marginVertical: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#7B2CBF",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginVertical: 10,
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: "#7B2CBF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
 modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
    modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: "85%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
   modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 12,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#2563EB",
    borderRadius: 30,
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 12,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#EF4444",
    borderRadius: 30,
    alignItems: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
    marginLeft: 6,
  },
});
