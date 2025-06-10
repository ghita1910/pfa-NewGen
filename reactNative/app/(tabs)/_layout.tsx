// app/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  I18nManager,
} from "react-native";
import { icons } from "@/constants";

// Récupération des dimensions de l'écran pour des styles adaptatifs
const { width } = Dimensions.get("window");

// Exemple simple de traduction pour l'internationalisation
const translations: { [key: string]: { [lang: string]: string } } = {
  home: { en: "Home", fr: "Accueil", es: "Inicio" },
  bookings: { en: "Bookings", fr: "Réservations", es: "Reservas" },
  calendar: { en: "Calendar", fr: "Calendrier", es: "Calendario" },
  inbox: { en: "Inbox", fr: "Boîte de réception", es: "Bandeja" },
  profile: { en: "Profile", fr: "Profil", es: "Perfil" },
};

// Simulons une fonction de traduction.
// Normalement, on récupérerait la langue de l'appareil via react-native-localize.
const getTranslation = (key: string, lang: string = "en") => {
  return translations[key] ? translations[key][lang] || translations[key]["en"] : key;
};

interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
  labelKey: string;
  language?: string;
}

const TabIcon = ({ source, focused, labelKey, language = "en" }: TabIconProps) => (
  <View style={styles.tabItem}>
    <Image
      source={source}
      style={[
        styles.icon,
        { tintColor: focused ? "#7B2CBF" : "#B0B3B8" },
      ]}
      resizeMode="contain"
    />
    <Text
      style={[
        styles.label,
        { color: focused ? "#7B2CBF" : "#8E8E93" },
      ]}
    >
      {getTranslation(labelKey, language)}
    </Text>
  </View>
);

export default function Layout() {
  // Vous pourriez récupérer la langue de l'utilisateur et le sens de lecture (LTR/RTL)
  // Par exemple : const userLanguage = Localization.locale.substring(0,2);
  const userLanguage = "en"; // ou "fr", "es", etc.

  return (
    <Tabs
      initialRouteName="oo"
      screenOptions={{
        headerShown: false,
        // Personnalisation globale de la tab bar
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="oo"
        options={{
          title: getTranslation("home", userLanguage),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} labelKey="home" language={userLanguage} />
          ),
        }}
      />
      <Tabs.Screen
        name="bb"
        options={{
          title: getTranslation("bookings", userLanguage),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.bokinn} focused={focused} labelKey="bookings" language={userLanguage} />
          ),
        }}
      />
      <Tabs.Screen
        name="cc"
        options={{
          title: getTranslation("CalendarScreen", userLanguage),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.calend} focused={focused} labelKey="calendar" language={userLanguage} />
          ),
        }}
      />
      <Tabs.Screen
        name="dd"
        options={{
          title: getTranslation("inbox", userLanguage),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.inb} focused={focused} labelKey="inbox" language={userLanguage} />
          ),
        }}
      />
      <Tabs.Screen
        name="ee"
        options={{
          title: getTranslation("profile", userLanguage),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} labelKey="profile" language={userLanguage} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#DADADA",
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  },
  tabItem: {
    paddingTop: 25,
    alignItems: "center",
    justifyContent: "center",
    // Utilisation d'une taille minimale proportionnelle à la largeur de l'écran
    minWidth: width * 0.15,
    gap: 2,
    // Gestion du support RTL : inversion de l'ordre si nécessaire
    flexDirection: I18nManager.isRTL ? "row-reverse" : "column",
  },
  icon: {
    width: 26,
    height: 26,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "Roboto", default: "System" }),
    marginTop: 4,
  },
});
