import { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMqttSensor } from "../hooks/useMqttSensor.js";
import { Api } from "../services/api.js";
import { DataTable } from "../components/DataTable.js";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export function MonitoringScreen() {
  const {
    temperature,
    timestamp,
    connectionState,
    error: mqttError,
  } = useMqttSensor();

  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const fetchReadings = useCallback(async (p = 1) => {
    setLoading(true);
    setApiError(null);
    try {
      const resp = await Api.getSensorReadings(p, LIMIT);
      setReadings(resp.data ?? []);
      setPage(resp.page ?? p);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReadings(1);
    }, [fetchReadings])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchReadings(page);
    } finally {
      setRefreshing(false);
    }
  }, [fetchReadings, page]);

  const goNext = () => fetchReadings(page + 1);
  const goPrev = () => {
    if (page > 1) fetchReadings(page - 1);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 0 }}   // <===== WAJIB
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* === Realtime Card === */}
        <View style={styles.card}>
          <Text style={styles.title}>Realtime Temperature</Text>

          <View style={styles.valueRow}>
            <Text style={styles.temperatureText}>
              {typeof temperature === "number"
                ? `${temperature.toFixed(2)}°C`
                : "--"}
            </Text>
          </View>

          <Text style={styles.metaText}>MQTT status: {connectionState}</Text>

          {timestamp && (
            <Text style={styles.metaText}>
              Last update: {new Date(timestamp).toLocaleString()}
            </Text>
          )}

          {mqttError && (
            <Text style={styles.errorText}>MQTT error: {mqttError}</Text>
          )}
        </View>

        {/* === Table Header === */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Triggered Readings History</Text>
          {loading && <ActivityIndicator />}
        </View>

        {apiError && (
          <Text style={styles.errorText}>
            Failed to load history: {apiError}
          </Text>
        )}

        <DataTable
          columns={[
            {
              key: "recorded_at",
              title: "Timestamp",
              render: (value) =>
                value ? new Date(value).toLocaleString() : "--",
            },
            {
              key: "temperature",
              title: "Temperature (°C)",
              render: (value) =>
                typeof value === "number"
                  ? `${Number(value).toFixed(2)}`
                  : "--",
            },
            {
              key: "threshold_value",
              title: "Threshold (°C)",
              render: (value) =>
                typeof value === "number"
                  ? `${Number(value).toFixed(2)}`
                  : "--",
            },
          ]}
          data={readings}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.pagination}>
          <Button title="Sebelumnya" onPress={goPrev} disabled={page <= 1} />
          <Text style={styles.pageText}>Page {page}</Text>
          <Button title="Berikutnya" onPress={goNext} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#ff7a59",
  },
  metaText: {
    marginTop: 8,
    color: "#555",
  },
  errorText: {
    marginTop: 8,
    color: "#c82333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  pageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: "#f8f9fb",
  },
});
