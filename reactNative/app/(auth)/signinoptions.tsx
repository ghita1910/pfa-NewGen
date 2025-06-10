import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Alert } from "react-native";
import { useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import * as Animatable from "react-native-animatable";
import { discovery } from "expo-auth-session/build/providers/Google";

const SignInOptions = () => {
  WebBrowser.maybeCompleteAuthSession();
const CLIENT_ID = "989482920039-feblbsom7rmcnpn5hgm67h0t7948qjlq.apps.googleusercontent.com";
const REDIRECT_URI = "https://auth.expo.io/@josef123ben/meak-app";

const [request, response, promptAsync] = AuthSession.useAuthRequest(
  {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ["profile", "email"],
    responseType: "code", // obligatoire
    usePKCE: true,        // obligatoire
  },
  discovery
);


useEffect(() => {
  const fetchTokenAndUser = async () => {
    if (response?.type === "success") {
      const { code } = response.params;

      if (!discovery) {
        console.error("Discovery document is not loaded.");
        return;
      }
      const tokenRes = await AuthSession.exchangeCodeAsync({
        clientId: CLIENT_ID,
        code,
        redirectUri: REDIRECT_URI,
        extraParams: { code_verifier: request?.codeVerifier ?? "" },
      }, discovery);

      const token = tokenRes.accessToken;
      fetchGoogleUser(token);
    }
  };

  fetchTokenAndUser();
}, [response]);


const fetchGoogleUser = async (token?: string) => {
  try {
    if (!token) return;
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    console.log("✅ Google user:", user);
    Alert.alert("Bienvenue", `Connecté : ${user.name}`);
    router.push("/(tabs)/oo");
  } catch (e) {
    console.error("Erreur Google fetch:", e);
  }
};

  const router = useRouter();

  return (
    <ImageBackground
      source={images.fondecran13}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.Image
            animation="fadeInDown"
            delay={100}
            duration={800}
            source={images.meak1}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Animatable.Text
            animation="fadeIn"
            delay={250}
            style={styles.title}
          >
            Let's you in
          </Animatable.Text>

          <Animatable.View
            animation="fadeInUp"
            delay={400}
            style={styles.socialContainer}
          >

            <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
  <Image source={icons.google} style={styles.socialIcon} />
  <Text style={styles.socialText}>Continue with Google</Text>
</TouchableOpacity>
            <TouchableOpacity
  style={styles.socialButton}
  onPress={() => {
    WebBrowser.openBrowserAsync("https://www.facebook.com/login");
  }}
>
  <Image source={icons.facebook} style={styles.socialIcon} />
  <Text style={styles.socialText}>Continue with Facebook</Text>
</TouchableOpacity>



            <TouchableOpacity
  style={styles.socialButton}
  onPress={() => WebBrowser.openBrowserAsync("https://login.microsoftonline.com")}
>
  <Image source={icons.apple} style={styles.socialIcon} />
  <Text style={styles.socialText}>Continue with Microsoft</Text>
</TouchableOpacity>

          </Animatable.View>

          <Animatable.View
            animation="fadeIn"
            delay={650}
            style={styles.separatorContainer}
          >
            <View style={styles.line} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.line} />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={800} style={{ width: "100%" }}>
            <CustomButton
              title="Sign in with password"
              onPress={() => router.push("/(auth)/signin")}
              style={styles.signInButton}
              textVariant="default"
            />
            <CustomButton
              title="Log in as guest"
              onPress={() => router.push("/(tabsvisiteur)/Home")}
              style={styles.signInButton}
              textVariant="default"
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={950} style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signUpLink}> Sign up</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignInOptions;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 11,
    paddingBottom: 40,
    alignItems: "center",
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "rgb(0, 0, 0)",
    marginBottom: 28,
  },
  socialContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(163, 119, 245, 0.28)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#7b2cbf",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    resizeMode: "contain",
  },
  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(163, 119, 245, 0.28)",
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "rgba(33, 33, 33, 0.85)",
    fontWeight: "500",
  },
  signInButton: {
    width: "100%",
    borderRadius: 14,
    marginBottom: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -10,
  },
  footerText: {
    color: "rgba(33, 33, 33, 0.85)",
    fontSize: 14,
  },
  signUpLink: {
    color: "#7b2cbf",
    fontWeight: "bold",
    fontSize: 14,
  },
});
