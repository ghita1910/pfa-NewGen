import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { TouchableOpacity, TextInput, Text, Image, ScrollView, StyleSheet, Modal, SafeAreaView, Alert, View ,ImageBackground} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import InputField2 from "@/components/InputField2"; // ajoute cette importation
import config from "@/config";

const ProviderProfile = () => {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(images.defaultProf);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [tarif, setTarif] = useState("0");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [description, setDescription] = useState("");
  const [cvFile, setCvFile] = useState<{ uri: string; name: string } | null>(null);
  const [cinPhoto, setCinPhoto] = useState<{ uri: string } | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    address: "",
    age: "",
    specialty: "",
    cinPhoto: "",
  });

  const specialties = [
    "Cleaning", "Repairing", "Laundry", "Appliance",
    "Plumbing", "Shifting", "Electricity", "Carpentry", "Gardening"
  ];

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
        }
      } catch (err) {
        console.warn("Erreur chargement Google :", err);
      }
    };
    loadFromGoogle();
  }, []);

  const validateFields = () => {
    const newErrors: any = {};
    if (!username) newErrors.username = "Nom d'utilisateur requis";
    if (!firstName) newErrors.firstName = "Prénom requis";
    if (!lastName) newErrors.lastName = "Nom requis";
    if (!address) newErrors.address = "Adresse requise";
    if (!age) newErrors.age = "Âge requis";
    if (!specialty) newErrors.specialty = "Spécialité requise";
    if (!cinPhoto?.uri) newErrors.cinPhoto = "Photo CIN requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<{ uri: string } | null>>,
    source: "camera" | "gallery"
  ) => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    }
    if (!result.canceled && result.assets?.length) {
      setImage({ uri: result.assets[0].uri });
    }
    setShowImagePicker(false);
  };

  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.assets?.[0]?.name?.endsWith(".pdf")) {
      setCvFile({ uri: result.assets[0].uri, name: result.assets[0].name });
    } else {
      Alert.alert("Only PDF files are accepted");
    }
  };

  const deleteImage = () => {
    setProfileImage(images.defaultProf);
    setShowImagePicker(false);
  };

  const getTypeTarifForSpecialty = (specialty: string): string => {
  switch (specialty) {
    case "Cleaning":
      return "m²";
    case "Repairing":
      return "service";
    case "Appliance":
      return "device";
    case "Laundry":
      return "kg";
    case "Plumbing":
        return "hour";
    case "Electricity":
        return "hour";
    case "Carpentry":
        return "hour";
    case "Gardening":
      return "hour";
    case "Shifting":
      return "room";
    default:
      return "service";
  }
};
  const handleSaveProfile = async () => {
    if (!validateFields()) return;

    try {
      const stored = await AsyncStorage.getItem("signupData");
      if (!stored) return Alert.alert("Erreur", "Données manquantes");
      const parsed = JSON.parse(stored);

      const formData = new FormData();

      if (profileImage.uri && profileImage !== images.clean1) {
        const uriParts = profileImage.uri.split(".");
        const ext = uriParts[uriParts.length - 1];
        formData.append("photo", {
          uri: profileImage.uri,
          name: `photo.${ext}`,
          type: `image/${ext}`,
        } as any);
      }

      if (cinPhoto?.uri) {
        const uriParts = cinPhoto.uri.split(".");
        const ext = uriParts[uriParts.length - 1];
        formData.append("cin_photo", {
          uri: cinPhoto.uri,
          name: `cin.${ext}`,
          type: `image/${ext}`,
        } as any);
      }

      if (cvFile) {
        formData.append("cv", {
          uri: cvFile.uri,
          name: cvFile.name,
          type: "application/pdf",
        } as any);
      }

      formData.append("email", parsed.email || "");
      formData.append("tel", parsed.tel || "");
      formData.append("password", parsed.password);
      formData.append("role", parsed.role);
      formData.append("nom", firstName);
      formData.append("prenom", lastName);
      formData.append("username", username);
      formData.append("adresse", address);

      if (latitude !== null) formData.append("latitude", latitude.toString());
      if (longitude !== null) formData.append("longitude", longitude.toString());

      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("description", description);
      formData.append("specialite", specialty);
      formData.append("experience", "");
      formData.append("tarif", tarif || "0");
      formData.append("typeTarif", getTypeTarifForSpecialty(specialty));

      const apiUrl = await config.getApiUrl();
      const response = await axios.post(apiUrl + "/auth/signup-prestataire", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Erreur", "Inscription échouée");
      }
    } catch (err: any) {
      console.error("Erreur d'inscription prestataire:", err);
      Alert.alert("Erreur", err?.response?.data?.detail || "Erreur inconnue");
    }
  };

  return (
      <ImageBackground
                 source={images.fondecran13}
                 style={styles.background}
                 resizeMode="cover"
               >
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fill Your Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
      placeholder="Enter last name"
      value={lastName}
      onChangeText={setLastName}
     iconComponent={<Ionicons name="person-outline" size={20} color="#7B2CBF" />}
    />
    {errors.lastName !== "" && (
      <Text style={styles.errorText}>{errors.lastName}</Text>
    )}
  </View>
</View>
  <InputField label="Username" placeholder="Enter username" value={username} onChangeText={setUsername} icon={icons.person} />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}


        <InputField
          label="Address"
          placeholder="Tap to auto-fill or type manually"
          value={address}
          onChangeText={setAddress}
           iconComponent={<Ionicons name="location-outline" size={22} color="#7B2CBF" />}
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
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <InputField
  label="Minimum Working Price (In DH)"
  placeholder="Enter Price In DH"
  value={tarif}
  onChangeText={setTarif}
  iconComponent={<Ionicons name="cash-outline" size={22} color="#7B2CBF" />}
  keyboardType="numeric"
/>




        <InputField label="Age" placeholder="Enter age" value={age} onChangeText={setAge} iconComponent={<Ionicons name="calendar-outline" size={22} color="#7B2CBF" />} keyboardType="numeric" />
        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

        <Text style={styles.genderText}>Gender</Text>
        <View style={styles.genderContainer}>
          {["Male", "Female"].map((item) => (
            <TouchableOpacity key={item} style={[styles.genderOption, gender === item && styles.genderSelected]} onPress={() => setGender(item)}>
              <Text style={[styles.genderText, gender === item && styles.genderSelectedText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>CIN Photo</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setCinPhoto, "camera")}>
          {cinPhoto ? (
            <Image source={{ uri: cinPhoto.uri }} style={styles.cinImage} />
          ) : (
            <Text style={styles.uploadText}>Upload CIN</Text>
          )}
        </TouchableOpacity>

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
        {errors.specialty && <Text style={styles.errorText}>{errors.specialty}</Text>}

        <Text style={styles.label}>Your Skills & Experience</Text>
        <TextInput
          style={styles.descriptionBox}
          multiline
          placeholder="Describe your skills, experience, training..."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Upload Your CV (optional)</Text>
        <TouchableOpacity onPress={pickPDF} style={styles.cvUpload}>
          <Text style={styles.cvText}>{cvFile ? cvFile.name : "Tap to upload PDF"}</Text>
        </TouchableOpacity>

        <CustomButton title="Save Profile" onPress={handleSaveProfile} style={styles.saveButton} />
      </ScrollView>

      <Modal transparent visible={showSuccessModal} animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Image source={icons.chekkk} style={styles.successIcon} />
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalMessage}>Your account is not yet active. It must be approved by an admin, and you will receive a confirmation email once approved..</Text>
            <CustomButton
              title="Ok"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/signin"); // ✅ Redirection vers la page de connexion
              }}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showImagePicker} animationType="fade" onRequestClose={() => setShowImagePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <CustomButton title="Use Camera" onPress={() => pickImage(setProfileImage, "camera")} style={styles.modalButton} />
            <CustomButton title="Use Gallery" onPress={() => pickImage(setProfileImage, "gallery")} style={styles.modalButton} />
            <CustomButton title="Delete Image" onPress={deleteImage} style={styles.deleteButton} />
            <CustomButton title="Cancel" onPress={() => setShowImagePicker(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default ProviderProfile;

const styles = StyleSheet.create({
   background:{
    flex: 1,

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

    container: {
      flex: 1,
      
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
     label: {
      fontSize: 15,
      fontWeight: "600",
      color: "black",
      marginTop: 16,
      marginBottom: 8,
    },
    imagePicker: {
      borderWidth: 1,
      borderColor: "#7B2CBF",
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
        backgroundColor: "#7B2CBF",
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
        backgroundColor: "#7B2CBF",
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
      borderColor: "#7B2CBF",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 10,
    },
    specialtySelected: {
      backgroundColor: "#7B2CBF",
    },
    specialtyText: {
      color: "#7B2CBF",
      fontWeight: "600",
    },
    specialtyTextSelected: {
      color: "#FFF",
    },
   descriptionBox: {
        height: 140,  // Augmenter un peu la hauteur pour plus de confort
        borderWidth: 1,
        borderColor: "#7B2CBF",  // Couleur plus douce et moderne
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
        borderColor: "#7B2CBF",  // Couleur de bordure plus douce et moderne
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
        color: "#7B2CBF",  // Couleur vive et contrastée
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

      errorText: {
        color: "#EF4444",
        fontSize: 13,
        marginTop: 4,
        marginBottom: 10,
        marginLeft: 6,
      },
  });