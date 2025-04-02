import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

const ProviderProfile = () => {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(images.clean1); // Default profile image
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState(""); // Add age state
  const [specialty, setSpecialty] = useState("");
  const [description, setDescription] = useState("");
  const [cvFile, setCvFile] = useState<{ name: string } | null>(null);
  const [cinFront, setCinFront] = useState<{ uri: string } | null>(null);
  const [cinBack, setCinBack] = useState<{ uri: string } | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false); // Image picker modal state
  const [imageSelected, setImageSelected] = useState(false); // Track if an image is selected
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state

  const specialties = [
    "Cleaning",
    "Repairing",
    "Laundry",
    "Appliance",
    "Plumbing",
    "Shifting",
    "Electricity",
    "Carpentry",
    "Gardening",
  ];

  // Function to handle image picking (camera or gallery)
  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<{ uri: string } | null>>, source: "camera" | "gallery") => {
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
      setImage({ uri: result.assets[0].uri });
      setImageSelected(true);
      setShowImagePicker(false);
    } else {
      setShowImagePicker(false);
    }
  };
  const handleSaveProfile = () => {
    setShowSuccessModal(true); // Show success modal when Save Profile is clicked
  };

  // Function to handle PDF file picking
  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result?.assets?.[0]?.name?.endsWith(".pdf")) {
      setCvFile(result.assets[0]);
    } else {
      Alert.alert("Only PDF files are accepted");
    }
  };

  

  // Handle deleting the profile image
  const deleteImage = () => {
    setProfileImage(images.clean1);
    setImageSelected(false);
    setShowImagePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
        
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fill Your Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image Section */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setShowImagePicker(true)}>
            <Image source={profileImage} style={styles.profileImage} />
            <View style={styles.cameraIcon}>
              <Image source={icons.cam} style={styles.cameraIconImage} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <InputField label="Username" placeholder="Enter username" value={username} onChangeText={setUsername} icon={icons.person} />
        <InputField label="First Name" placeholder="Enter first name" value={firstName} onChangeText={setFirstName} icon={icons.person} />
        <InputField label="Last Name" placeholder="Enter last name" value={lastName} onChangeText={setLastName} icon={icons.person} />
        <InputField label="Address" placeholder="Enter address" value={address} onChangeText={setAddress} icon={icons.locatin} />
        <InputField label="Age" placeholder="Enter age" value={age} onChangeText={setAge} icon={icons.birth} />

        {/* Gender Selection */}
        <Text style={styles.genderText}>Gender</Text>
        <View style={styles.genderContainer}>
          {["Male", "Female"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.genderOption, gender === item && styles.genderSelected]}
              onPress={() => setGender(item)}
            >
              <Text style={[styles.genderText, gender === item && styles.genderSelectedText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CIN Front */}
        <Text style={styles.label}>CIN - Front Side</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setCinFront, "camera")}>
          {cinFront ? <Image source={{ uri: cinFront.uri }} style={styles.cinImage} /> : <Text style={styles.uploadText}>Upload Front Side</Text>}
        </TouchableOpacity>

        {/* CIN Back */}
        <Text style={styles.label}>CIN - Back Side</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setCinBack, "camera")}>
          {cinBack ? <Image source={{ uri: cinBack.uri }} style={styles.cinImage} /> : <Text style={styles.uploadText}>Upload Back Side</Text>}
        </TouchableOpacity>

        {/* Specialty Selection */}
        <Text style={styles.label}>Select Specialty</Text>
        <View style={styles.specialtyWrap}>
          {specialties.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.specialtyOption, specialty === item && styles.specialtySelected]}
              onPress={() => setSpecialty(item)}
            >
              <Text style={[styles.specialtyText, specialty === item && styles.specialtyTextSelected]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Your Skills & Experience</Text>
        <TextInput
          style={styles.descriptionBox}
          multiline
          placeholder="Describe your skills, experience, training..."
          value={description}
          onChangeText={setDescription}
        />

        {/* Upload CV */}
        <Text style={styles.label}>Upload Your CV (optional)</Text>
        <TouchableOpacity onPress={pickPDF} style={styles.cvUpload}>
          <Text style={styles.cvText}>{cvFile ? cvFile.name : "Tap to upload PDF"}</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <CustomButton
            title="Save Profile"
            onPress={handleSaveProfile} // Trigger success modal on click
            style={styles.saveButton}
          />
        
      </ScrollView>

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
      <Modal transparent visible={showImagePicker} animationType="fade" onRequestClose={() => setShowImagePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <CustomButton title="Use Camera" onPress={() => pickImage(setProfileImage, "camera")} style={styles.modalButton} IconLeft={() => <Ionicons name="camera" size={20} color="#fff" style={styles.iconSpacing} />} />
            <CustomButton title="Use Gallery" onPress={() => pickImage(setProfileImage, "gallery")} style={styles.modalButton} IconLeft={() => <Ionicons name="image" size={20} color="#fff" style={styles.iconSpacing} />} />
            <CustomButton title="Cancel" onPress={() => setShowImagePicker(false)} style={styles.modalButton} IconLeft={() => <Ionicons name="close" size={20} color="#fff" style={styles.iconSpacing} />} />
            <CustomButton title="Delete Image" onPress={deleteImage} style={styles.deleteButton} IconLeft={() => <Ionicons name="trash" size={20} color="#fff" style={styles.iconSpacing} />} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProviderProfile;


const styles = StyleSheet.create({
  
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
      header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        marginLeft:10,
        marginTop:10,
      },
      headerTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1F2937",
        letterSpacing: 0.8,
        textTransform: "uppercase",
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

    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: "#1E293B",
      marginTop: 16,
      marginBottom: 8,
    },
    imagePicker: {
      borderWidth: 1,
      borderColor: "#CBD5E1",
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      height: 150,
      backgroundColor: "#F1F5F9",
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
      iconSpacing: { marginRight: 10 },
    uploadText: {
      color: "#64748B",
    },
    saveButton: {
        marginTop: 30,
        paddingVertical: 12,
        backgroundColor: "#2563EB",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
      },
    cinImage: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    specialtyWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    specialtyOption: {
      borderWidth: 1,
      borderColor: "#3B82F6",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 10,
    },
    specialtySelected: {
      backgroundColor: "#3B82F6",
    },
    specialtyText: {
      color: "#3B82F6",
      fontWeight: "600",
    },
    specialtyTextSelected: {
      color: "#FFF",
    },
    descriptionBox: {
        height: 140,  // Augmenter un peu la hauteur pour plus de confort
        borderWidth: 1,
        borderColor: "#E0E7FF",  // Couleur plus douce et moderne
        borderRadius: 16,  // Coins légèrement plus arrondis pour un aspect moderne
        backgroundColor: "#F9FAFB",  // Fond plus doux et subtilement texturé
        padding: 18,  // Plus d'espace interne pour un meilleur confort visuel
        fontSize: 16,  // Légèrement plus grand pour la lisibilité
        color: "#2C3E50",  // Couleur plus foncée pour un contraste optimal
        textAlignVertical: "top",
        fontFamily: "Arial, sans-serif",  // Police plus moderne
        shadowColor: "#000",  // Ombre légère pour un effet de profondeur
        shadowOffset: { width: 0, height: 4 },  // Déplacement de l'ombre pour plus de réalisme
        shadowOpacity: 0.1,  // Ombre subtile mais efficace
        shadowRadius: 8,  // Rayon de l'ombre pour la douceur
        elevation: 4,  // Pour un effet sur Android (si nécessaire)
        minHeight: 120,  // Assurer une hauteur minimale pour une meilleure lisibilité
        resizeMode: 'contain',  // Ajuster la taille du texte pour éviter les débordements
    },
    
    cvUpload: {
        padding: 18,  // Plus de confort pour l'utilisateur
        borderWidth: 2,  // Bordure un peu plus marquée
        borderColor: "#E0E7FF",  // Couleur de bordure plus douce et moderne
        borderRadius: 16,  // Coins plus arrondis pour un look moderne
        backgroundColor: "#F1F5F9",  // Fond plus doux et léger, agréable visuellement
        alignItems: "center",
        justifyContent: "center",
        width: "100%",  // S'assurer que l'élément occupe toute la largeur disponible
        minHeight: 50,  // Hauteur minimale pour maintenir l'élément visible
        flexDirection: "row",  // Utilisation de flexbox pour un meilleur alignement
        cursor: "pointer",  // Indicateur visuel pour l'interaction (si nécessaire)
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",  // Ombre légère pour un effet de profondeur
       
    },
    cvText: {
        color: "#3B82F6",  // Couleur vive et contrastée
        fontWeight: "600",  // Poids plus prononcé pour plus de lisibilité
        fontSize: 16,  // Taille de la police ajustée pour un meilleur confort
        fontFamily: "Roboto, sans-serif",  // Police moderne et universelle
        textAlign: "center",  // Centrer le texte pour un meilleur alignement
        letterSpacing: 0.5,  // Légèrement plus d'espacement entre les lettres pour améliorer la lisibilité
       
    },
    
    submitButton: {
      marginTop: 30,
      borderRadius: 30,
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
  });