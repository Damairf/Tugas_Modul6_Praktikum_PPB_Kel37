import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// jangan auto-hide
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function CustomSplash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      onFinish();
    }, 2000); // tampil 2 detik

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Kelompok 37</Text>

      <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e40af",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
});
