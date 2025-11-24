// src/screens/ProfileScreen.js
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext.js";

export function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    async function load() {
      const me = await Auth.me();
      if (me) setProfile(me);
    }
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>
      <View style={styles.card}>
        <Text style={styles.key}>Username</Text>
        <Text style={styles.value}>{profile?.username ?? "-"}</Text>

        <Text style={styles.key}>ID</Text>
        <Text style={styles.value}>{profile?.id ?? "-"}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f9fb" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  key: { fontWeight: "600", color: "#444", marginTop: 8 },
  value: { marginTop: 4, color: "#111" },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600" },
});
