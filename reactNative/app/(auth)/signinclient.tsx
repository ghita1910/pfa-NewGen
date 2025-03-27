import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get("window");

const FormPage = () => {
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState({
    english: false,
    Portuguese: false,
    nigerian: false,
    spanish: false,
  });

  const handleLanguageChange = (language: keyof typeof selectedLanguages) => {
    setSelectedLanguages((prevState) => ({
      ...prevState,
      [language]: !prevState[language],
    }));
  };

  const handleSave = () => {
    console.log("Form Data:", { address, country, selectedLanguages });
  };

  return (
    <View style={styles.container}>
      {/* SVG en haut */}
      <View style={styles.waveTop}>
        <Svg height={150} width={width} viewBox="0 0 1440 320">
          <Path
            fill="#6e7fcd"
            d="M0,160L80,149.3C160,139,320,117,480,133.3C640,149,800,203,960,229.3C1120,256,1280,256,1360,256L1440,256L1440,0L0,0Z"
          />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.header}>
          <Image source={{ uri: 'path/to/your/icon.png' }} style={styles.icon} />
        </View>

        <Text style={styles.title}>Enter Your Details</Text>

        <InputField label="Enter Your Address" placeholder="Lagos" icon={icons.chat} onChangeText={setAddress} />
        <InputField label="Enter Your Country" placeholder="Nigeria" icon={icons.X} onChangeText={setCountry} />

        <View style={styles.languagesContainer}>
          <Text style={styles.label}>Select Your Language</Text>
          {(["english", "Portuguese", "nigerian", "spanish"] as Array<keyof typeof selectedLanguages>).map((language) => (
            <TouchableOpacity
              key={language}
              style={[
                styles.languageOption,
                selectedLanguages[language] && styles.selectedLanguage,
              ]}
              onPress={() => handleLanguageChange(language)}
            >
              <Text style={styles.languageText}>
                {language.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomButton title="Save Details" bgVariant="primary" textVariant="default" onPress={handleSave} />
      </ScrollView>

      {/* SVG en bas */}
      <View style={styles.waveBottom}>
        <Svg height={150} width={width} viewBox="0 -65 1400 320">
          <Path
            fill="#6e7fcd"
            d="M0,160L80,149.3C160,139,320,117,480,133.3C640,149,800,203,960,229.3C1120,256,1280,256,1360,256L1440,256L1440,320L0,320Z"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: " # D3D3D3",
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50, // Ajout pour éviter la superposition du SVG
    paddingBottom: 150, // Pour éviter la superposition avec le SVG en bas
  },
  waveTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  waveBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: "#333",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
  },
  languagesContainer: {
    marginVertical: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  selectedLanguage: {
    backgroundColor: "#0286FF",
    borderColor: "#0286FF",
  },
  languageText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
});

export default FormPage;
