import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="detection" options={{ headerShown: false }} />
      <Stack.Screen name="signinoptions" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />

      
     
    </Stack>
  );
};

export default Layout;