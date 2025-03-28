import React, { useState, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState(images.clean1); // Default profile image
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Removed duplicate declaration of progress and setProgress
  // Removed duplicate declaration of progress and setProgress

  // Demander l'autorisation de la caméra à l'ouverture de l'écran
  useEffect(() => {
    const requestPermissions = async () => {
      // Demander la permission pour la caméra
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      // Demander la permission pour la galerie
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted") {
        alert("Permission to access camera is required!");
      }

      if (galleryStatus !== "granted") {
        alert("Permission to access gallery is required!");
      }
    };


    requestPermissions();
  }, []);

  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    }

    // Vérifier si la sélection a été réussie
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
      setShowImagePicker(false);  // Fermer le modal après la sélection
    } else {
      setShowImagePicker(false);  // Fermer le modal même si aucune image n'est sélectionnée
    }
  };

  const deleteImage = () => {
    setProfileImage(images.clean1); // Réinitialiser l'image de profil à l'image par défaut
    setShowImagePicker(false); // Fermer le modal après la suppression
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [showImagePicker, setShowImagePicker] = useState(false); // State for image picker modal visibility

// Function to calculate and update progress based on filled fields
const calculateProgress = () => {
  let filledFields = 0;

  // Check each field's completion status
  if (username) filledFields++;
  if (firstName) filledFields++;
  if (lastName) filledFields++;
  if (address) filledFields++;
  if (gender) filledFields++;

  // Calculate the progress as a percentage
  const progressPercentage = (filledFields / 5) * 100;

  // Animate the progress bar
  Animated.timing(progress, {
    toValue: progressPercentage,
    duration: 500,
    useNativeDriver: false,
  }).start();
};

useEffect(() => {
  calculateProgress();
}, [username, firstName, lastName, address, gender]);


  return (
    
    <SafeAreaView style={styles.container}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
                  source={images.tourn}
                  style={styles.illustration}
                  resizeMode="contain"
                />
          <View style={styles.headerContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() => setShowImagePicker(true)}
            >
              <Image source={icons.cam} style={styles.cameraIconImage} />
            </TouchableOpacity>
          </View>

          <InputField
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            icon={icons.person}
          />

          <InputField
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
            icon={icons.person}
          />

          <InputField
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
            icon={icons.person}
          />

          <InputField
            label="Address"
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            icon={icons.locatin}
          />

          <InputField
            label="Birth Date"
            placeholder="Enter age"
            icon={icons.birth}
          />

          <View style={styles.genderContainer}>
            {["Male", "Female"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.genderOption,
                  gender === item && styles.genderSelected,
                ]}
                onPress={() => setGender(item)}
              >
                <Text style={styles.genderText}>{item}</Text>
              </TouchableOpacity>
            ))}
            
          </View>
          <Text style={styles.progressText}>Profile Completion</Text>
          <View style={styles.progressBarContainer}>
  
  <Animated.View
    style={[styles.progressBar, { width: progress.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      })
    }]}
  />
</View>
          

          <CustomButton
            title="Save Profile"
            onPress={() => console.log("Profile Saved")}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={showImagePicker}
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <CustomButton
              title="Use Camera"
              onPress={() => {
                pickImage("camera");
              }}
              style={styles.modalButton}
            />
            <CustomButton
              title="Use Gallery"
              onPress={() => {
                pickImage("gallery");
              }}
              style={styles.modalButton}
            />
           
            <CustomButton
              title="Cancel"
              onPress={() => setShowImagePicker(false)}
              style={styles.modalButton}
            />
             {/* Added delete button */}
             <CustomButton
              title="Delete Image"
              onPress={deleteImage}
              style={styles.deleteButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Fond blanc pour un look propre et moderne
    paddingTop: 30,
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
    borderColor: "#0286FF", // Ajout d'une bordure autour de l'image
    marginBottom: 15,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#0286FF",
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "",
  },
  cameraIconImage: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  illustration: {
    width: "100%",
    height: 200,
    alignSelf: "center",
    bottom:10,
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
    borderColor: "#0286FF",
    width: "45%",
    alignItems: "center",
    backgroundColor: "#F3F4F6", // Fond gris clair pour les options de genre
  },
  genderSelected: {
    backgroundColor: "#0286FF", // Changer la couleur de fond lorsque sélectionné
    borderColor: "#0286FF",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0286FF", // Mettre en avant le texte du genre
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: "#0286FF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#FF3B60",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 12,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#0286FF",
    borderRadius: 30,
    alignItems: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    marginVertical: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0286FF",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
    textAlign: "left",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
});
