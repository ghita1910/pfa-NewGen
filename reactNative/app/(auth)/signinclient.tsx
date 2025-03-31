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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";


import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";

const UserProfile = () => {
   const router = useRouter();
  
  const [profileImage, setProfileImage] = useState(images.clean1); // Default profile image
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState(new Date());
  const [age, setAge] = useState(""); // Add age state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [showImagePicker, setShowImagePicker] = useState(false); // State for image picker modal visibility
  const [imageSelected, setImageSelected] = useState(false); // To track if an image is selected
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state

  // Function to calculate and update progress based on filled fields
  const calculateProgress = () => {
    let filledFields = 0;

    // Check each field's completion status
    if (username) filledFields++;
    if (firstName) filledFields++;
    if (lastName) filledFields++;
    if (address) filledFields++;
    if (gender) filledFields++;
    if (age) filledFields++; // Include age in the progress calculation

    // Calculate the progress as a percentage
    const progressPercentage = (filledFields / 6) * 100; // Update to 6 since age is now included

    // Animate the progress bar
    Animated.timing(progress, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    calculateProgress();
  }, [username, firstName, lastName, address, gender, age]); // Update the dependencies to include age

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
      setImageSelected(true);
      setShowImagePicker(false);
    } else {
      setShowImagePicker(false);
    }
  };

  const deleteImage = () => {
    setProfileImage(images.clean1);
    setImageSelected(false);
    setShowImagePicker(false);
  };

  const handleSaveProfile = () => {
    setShowSuccessModal(true); // Show success modal when Save Profile is clicked
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoiding}
      >
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
            label="Age"
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
            icon={icons.birth}
          />

          <Text style={styles.genderText}>Gender</Text>
          <View style={styles.genderContainer}>
            {["Male", "Female"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.genderOption, gender === item && styles.genderSelected]}
                onPress={() => setGender(item)}
              >
                <Text style={[styles.genderText, gender === item && styles.genderSelectedText]}>
                  {item}
                </Text>
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

          <CustomButton
            title="Save Profile"
            onPress={handleSaveProfile} // Trigger success modal on click
            style={styles.saveButton}
          />
        </ScrollView>
        
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay} onStartShouldSetResponder={() => { setShowSuccessModal(false); return true; }}>
          <View style={styles.modalBox}>
            <Image source={icons.chekkk} style={styles.successIcon} />
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalMessage}>
              Your account is ready to use. You will be redirected to the Home page in a few seconds..
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => console.log("Navigate to Home")}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
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
  onPress={() => pickImage("camera")}
  style={styles.modalButton}
  IconLeft={() => <Ionicons name="camera" size={20} color="#fff"  style={styles.iconSpacing}/>}
/>

<CustomButton
  title="Use Gallery"
  onPress={() => pickImage("gallery")}
  style={styles.modalButton}
  IconLeft={() => <Ionicons name="image" size={20} color="#fff"  style={styles.iconSpacing} />}
/>

<CustomButton
  title="Cancel"
  onPress={() => setShowImagePicker(false)}
  style={styles.modalButton}
  IconLeft={() => <Ionicons name="close" size={20} color="#fff"  style={styles.iconSpacing} />}
/>

<CustomButton
  title="Delete Image"
  onPress={deleteImage}
  style={styles.deleteButton}
  IconLeft={() => <Ionicons name="trash" size={20} color="#fff"  style={styles.iconSpacing} />}
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
    backgroundColor: "#F9FAFB", // Light and modern background
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
    backgroundColor: "#2563EB",
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
    borderColor: "#3B82F6",
    marginBottom: 15,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    left: 72,
    backgroundColor: "#2563EB",
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
    borderColor: "#3B82F6",
    width: "45%",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  genderSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  genderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
  },
  genderSelectedText: {
    color: "#FFFFFF",
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: "#2563EB",
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
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    marginVertical: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginVertical: 10,
  },
  successIcon: {
    width: 53,
    height: 53,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  iconSpacing: { marginRight: 10 },
});
